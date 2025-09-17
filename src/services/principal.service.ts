import { getPrincipalSchemaType } from '../api/schemas/principal.schema';
import heliosDB from '../database/helios';

const models = heliosDB.models

export const getSelectPrincipals = async(filters:any) => {
    return await models.customer_master_tbl.findAll({
        where:{
            ...filters
        }
    })
    .then(result => JSON.parse(JSON.stringify(result)))
}

export const getPrincipals = async (filters: getPrincipalSchemaType) => {
    const { page, limit, search, ...where } = filters;

    const { rows, count } = await models.customer_master_tbl.findAndCountAll({
        order: [['created_at', 'desc'], ['customer_code', 'asc']],
        offset: +page * +limit,
        limit: +limit,
        where: {
            ...where
        }
    })

    return {
        rows,
        count,
        pageCount: Math.ceil(count / +limit)
    }
}


export const getPrincipalById = async (id: string) => {
    return await models.customer_master_tbl.findByPk(id);
}

