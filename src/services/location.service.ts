import { getLocationSchemaType } from '../api/schemas/location.schema';
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