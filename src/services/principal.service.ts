import heliosDB from '../database/helios';

const models = heliosDB.models

export const getPrincipals = async(filters:any) => {
    return await models.customer_master_tbl.findAll({
        where:{
            ...filters
        }
    })
    .then(result => JSON.parse(JSON.stringify(result)))
}