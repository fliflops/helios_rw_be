import heliosDB from '../database/helios';

const models = heliosDB.models

export const getUserLocations = async(filters:any) => {
    return await models.user_location_tbl.findAll({
        include: [
            {
                model: models.location_tbl,
                as:'location'
            }
        ],
        where:{
            ...filters
        }
    })
    .then(result => JSON.parse(JSON.stringify(result)))
}

