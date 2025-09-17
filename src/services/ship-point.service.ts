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