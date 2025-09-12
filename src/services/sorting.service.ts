import moment from 'moment';
import { getBarcodeSchemaType } from '../api/schemas/sorting.schema';
import heliosDB from '../database/helios';
import { col, fn, Op, Transaction, where } from 'sequelize';

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