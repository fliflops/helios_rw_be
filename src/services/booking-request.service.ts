import heliosDB from '../database/helios';
import * as podSchema from '../api/schemas/view-pod.schemas';

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

