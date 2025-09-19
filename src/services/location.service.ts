import { createLocationType, getLocationSchemaType, updateLocationType } from '../api/schemas/location.schema';
import heliosDB from '../database/helios';

const models = heliosDB.models

export const getLocations = async (filters: getLocationSchemaType) => {
    const { page, limit, search, ...where } = filters;

    const { rows, count } = await models.location_tbl.findAndCountAll({
        order: [['created_at', 'desc'], ['loc_name', 'asc']],
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

export const getLocationById = async (id: string) => {
    return await models.location_tbl.findByPk(id)
}

export const updateLocationById = async (id: string, payload: updateLocationType) => {

    try {
        const [count] = await models.location_tbl.update(payload, { where: { id } });
        if (count > 0) {
            return await getLocationById(id);
        }
    } catch (err: any) {
        throw new Error(err.message ? err.message : "Unable to update location")
    }

    throw new Error("Nothing to change")
}

export const createLocation = async (payload: createLocationType) => {
    return await models.location_tbl.create({ ...payload });
}