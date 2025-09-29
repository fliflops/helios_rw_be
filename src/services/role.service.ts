import heliosDB from '../database/helios';

const models = heliosDB.models

export const getSelectRoles = async(filters:any) => {
    return await models.role_tbl.findAll({
        where:{
            ...filters
        }
    })
    .then(result => JSON.parse(JSON.stringify(result)))
}

