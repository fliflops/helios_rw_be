import moment from 'moment';
import { getBarcodeSchemaType, getSortingCountType } from '../api/schemas/sorting.schema';
import heliosDB from '../database/helios';
import { col, fn, InferAttributes, InferCreationAttributes, Op, Transaction, where } from 'sequelize';
import redis from '../utils/redis'
import sorting_tbl from '../database/helios/models/sorting_tbl';

const models = heliosDB.models;

export const getPaginatedBarcodes = async(filters:getBarcodeSchemaType) => {
    const {page,limit,search, ...where} = filters;

    const { rows,count } = await models.sorting_tbl.findAndCountAll({
        order:[['created_at','desc'], ['barcode', 'desc']],
        offset: parseInt(page) * parseFloat(limit),
        limit: parseInt(limit),
        where:{
            ...where
        }
    })

    return {
        rows,
        count,
        pageCount: Math.ceil(count/parseInt(limit))
    }
}

export const generateBarcode = async(params: {
    location:string;
    count: number;
}) => {
  
    let series:string[] = [];
    const today = moment().format('MMDDYY');
    const prefix = params.location.substring(0,3).toUpperCase()
    
    const barcodeCount = await models.sorting_tbl.count({
        where:{
            location: params.location,
            [Op.and]: [
               where(fn('DATE', col('created_at')), moment().format('YYYY-MM-DD'))
            ]
        }
    })

    let suffix:number = barcodeCount + 1;

    for(let x = 1; x <= params.count; x++ ){

        series.push(`${prefix}-${today}-${String(suffix).padStart(4,'0')}`)

        suffix = suffix+=1;
    }


    return series;
}

export const createBarcode = async(params: {barcodes:string[]; created_by: string; location: string}, transaction?: Transaction) => {
    return await models.sorting_tbl.bulkCreate(params.barcodes.map(item => {
        return {
            barcode: item,
            location: params.location,
            created_by: params.created_by,
            is_assigned: false
        }
    }),
    {
        transaction
    })
}

export const getBarcode = async(filter:any) => {
    return await models.sorting_tbl.findOne({
        where:{
            ...filter
        }
    }) as sorting_tbl

} 

export const getAllBarcodes = async(filter:any) => {
    return await models.sorting_tbl.findAll({
        where:{
            ...filter
        }
    }) as sorting_tbl[]
}

export const createSortingSession = async(params:{
    header: {
        user_id:string;
        location_code: string;
        ship_to_code?:string;
        service_type: string;
        delivery_date_from: string;
        delivery_date_to: string
    };
    details: { id: string; br_no:string, invoice_no:string, dr_no:string,user_id: string }[]
}) => {
    // create sorting header
    const headerKey = `helios:sorting_session:${params.header.user_id}`
    const headerValue = JSON.stringify({
        ...params.header
    })
    
    //create sorting details
    let details:{
        [key:string]: string
    } = {}

    params.details.map(item => {
        const key = `helios:sorting_details:${item.user_id}:${item.br_no}`
        details[key] = JSON.stringify({
            ...item,
            is_assigned: false,
            barcode: null
        }) 
    })

   await redis.multi()
    .set(headerKey,headerValue)
    .mSet(details)
    .exec();
}

export const getSortingSession = async(user_id:string) => {
    
    const sortingFilters = await redis.get(`helios:sorting_session:${user_id}`).then(result => {
        if(!result) return null; 
        return JSON.parse(result) as getSortingCountType
    })
    if(sortingFilters) return sortingFilters
    return null
}

export const getAllSortingSessionDetails = async(params: {user_id:string}) => {
    const detailKeys = await redis.keys(`helios:sorting_details:${params.user_id}:*`)
    const details = await redis.mGet(detailKeys);

    return details.map((item,index) => {
        return {
            key: detailKeys[index],
            data:JSON.parse(item as string) as {
                dr_no:string;
                invoice_no:string;
                is_assigned: boolean;
                br_no:string;
                service_type:string;
                shipment_manifest:string;
                ship_to_code:string;
                barcode: string
            }
           
        }
    })
}

export const getSortingDetails = async(key: string) => {
    const pod = await redis.get(key)

    if(!pod) return null;
    return JSON.parse(pod)
}

export const updateSortingDetail = async(params: {key:string; 
    data: {
        dr_no:string;
        invoice_no:string;
        is_assigned: boolean;
        br_no:string;
        service_type:string;
        shipment_manifest:string;
        ship_to_code:string;
        barcode: string;
    }}) => {

    await redis.set(params.key, JSON.stringify(params.data))
}   

export const cancelSortingSession = async (params: {user_id: string}) => {
    const headerKey = `helios:sorting_session:${params.user_id}`
    const detailKeys = await redis.keys(`helios:sorting_details:${params.user_id}:*`)

    await redis.multi()
    .del(detailKeys.concat([headerKey]))
    .exec();
}

export const updateSortingTable = async(params: {data:any; filters: any;}, transaction?: Transaction) => {
    return await models.sorting_tbl.update({
        ...params.data
    },
    {
        where:{
            ...params.filters
        },
        transaction
    })
}

