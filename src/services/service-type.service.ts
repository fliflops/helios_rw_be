import heliosDB from '../database/helios';

const models = heliosDB.models

export const getServiceTypes = async(filters:any) => {
    return await models.service_type_master_tbl.findAll({
        where:{
            ...filters
        }
    })
}