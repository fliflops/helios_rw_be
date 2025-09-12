import heliosDB from '../database/helios';

const models = heliosDB.models;

export const getShipPoints = async(filters:any) => {
    return await models.ship_point_master_tbl.findAll({
        where:{
            ...filters
        }
    })
    .then(result => JSON.parse(JSON.stringify(result)))
}