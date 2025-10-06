import { getRoleType, roleType, updateRoleType } from '../api/schemas/role.schema';
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

export const createRole = async (payload: roleType) => {
    return await models.role_tbl.create({ ...payload });
}

export const getRole = async(filters: any) => {
    return await models.role_tbl.findOne({
        where:{
            ...filters
        }
    })
    .then(result => {
        if(!result) return null;

        const data = JSON.parse(JSON.stringify(result));

        return data
    })
}

export const getRoles = async (filters: getRoleType) => {
    const { page, limit, search, ...where } = filters;

    const { rows, count } = await models.role_tbl.findAndCountAll({
        order: [['created_at', 'desc']],
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

export const getRoleById = async (id: string) => {
    return await models.role_tbl.findByPk(id);
}

export const updateRoleById = async (id: string, payload: updateRoleType) => {
    try {
        const [count] = await models.role_tbl.update(payload, { where: { id } });
        if (count > 0 ) {
            return await getRoleById(id);
        }
    } catch (err: any) {
        throw new Error(err.message ? err.message : "Unable to update Role")
    }

    throw new Error("Nothing to change")
}