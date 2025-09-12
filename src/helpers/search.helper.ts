import { Op } from "sequelize"

const searchService = (params: {
    search?:string,
    fields: string[]
}) => {
    if(!params.search) return {};

    return {
        [Op.or] : params.fields.map(name => {
            return {
                [name] : {
                    [Op.like]: `%${params.search}%`
                }
            }
        })
    }
}

export default searchService