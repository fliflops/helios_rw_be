import { createShipPointType, updateShipPointType } from '../api/schemas/ship-point.schema';
import heliosDB from '../database/helios';

const models = heliosDB.models;

export const getShipPoints = async(filters:any) => {
    const { page, limit, search, ...where } = filters;

    const { rows, count } = await models.ship_point_master_tbl.findAndCountAll({
        order: [['created_at', 'desc'], ['ship_point_desc', 'asc']],
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

export const getSelectShipPoints = async(filters:any) => {
    return await models.ship_point_master_tbl.findAll({
        where:{
            ...filters
        }
    })
    .then(result => JSON.parse(JSON.stringify(result)))
}

export const getShipPointById = async (id: string) => {
    return await models.ship_point_master_tbl.findByPk(id);
}


export const updateShipPointById = async (id: string, payload: updateShipPointType) => {

    try {
        const [count] = await models.ship_point_master_tbl.update(payload, { where: { id } });
        if (count > 0 ) {
            return await getShipPointById(id);
        }
    } catch (err: any) {
        throw new Error(err.message ? err.message : "Unable to update ship point")
    }

    throw new Error("Nothing to change")
}

export const createShipPoint = async (payload: createShipPointType) => {
    return await models.ship_point_master_tbl.create({ ...payload });
}