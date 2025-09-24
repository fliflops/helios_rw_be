import heliosDB from '../database/helios';
import * as podSchema from '../api/schemas/view-pod.schemas';
import redis from '../utils/redis';

const models = heliosDB.models


export const getPaginatedBookingRequest = async(filters: podSchema.getPODSChemaType) => {
    const {page,limit,search, ...where} = filters;

    const {rows,count} =  await models.booking_request_hdr_tbl.findAndCountAll({
        order:[['created_at','desc'],['br_no','desc']],
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

export const getBookingRequestCount = async(filters: any) => {
    return await models.booking_request_hdr_tbl.count({
        where:{
            ...filters
        }
    })
}

export const getBookingRequests = async(filters: any) => {
    return await models.booking_request_hdr_tbl.findAll({
        where:{
            ...filters
        }
    })
    .then(result => JSON.parse(JSON.stringify(result)))
}

