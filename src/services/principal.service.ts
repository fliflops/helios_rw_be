import { createPrincipalType, getPrincipalSchemaType, updatePrincipalType } from '../api/schemas/principal.schema';
import heliosDB from '../database/helios';

const models = heliosDB.models

export const getSelectPrincipals = async (filters: any) => {
    return await models.customer_master_tbl.findAll({
        where: {
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

export const updatePrincipalById = async (id: string, payload: updatePrincipalType) => {

    try {
        const [count] = await models.customer_master_tbl.update(payload, { where: { id } });
        if (count > 0 ) {
            return await getPrincipalById(id);
        }
    } catch (err: any) {
        throw new Error(err.message ? err.message : "Unable to update principal")
    }

    throw new Error("Nothing to change")
}

export const createPrincipal = async (payload: createPrincipalType) => {
    return await models.customer_master_tbl.create({ ...payload });
}