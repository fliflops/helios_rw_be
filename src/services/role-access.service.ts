import { getRoleAccessType, getRoleType, roleAccessType, roleType, updateRoleType } from '../api/schemas/role.schema';
import heliosDB from '../database/helios';

const models = heliosDB.models

export const getSelectRoleAccess = async(filters:any) => {
    return await models.role_access_tbl2.findAll({
        where:{
            ...filters
        }
    })
    .then(result => JSON.parse(JSON.stringify(result)))
}

export const batchCreateUpdateRoleAccess = async (payload: roleAccessType[]) => {
    return await models.role_access_tbl2.bulkCreate(payload, {
        updateOnDuplicate: ["view", "create", "edit", "export", "updated_by"],
    })
}

export const createRoleAccess = async (payload: roleType) => {
    return await models.role_access_tbl2.create({ ...payload });
}

export const getOneRoleAccess = async(filters: any) => {
    return await models.role_access_tbl2.findOne({
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

export const getAllRoleAccess = async (filters: getRoleAccessType) => {
    const { page, limit, search, ...where } = filters;

    console.log(filters);
    

    const { rows, count } = await models.role_access_tbl2.findAndCountAll({
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

export const getRoleAccessById = async (id: string) => {
    return await models.role_access_tbl2.findByPk(id);
}

export const updateRoleAccessById = async (id: string, payload: updateRoleType) => {
    try {
        const [count] = await models.role_access_tbl2.update(payload, { where: { id } });
        if (count > 0 ) {
            return await getRoleAccessById(id);
        }
    } catch (err: any) {
        throw new Error(err.message ? err.message : "Unable to update role access")
    }

    throw new Error("Nothing to change")
}