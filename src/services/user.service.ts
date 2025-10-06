import { col, Transaction } from 'sequelize';
import heliosDB from '../database/helios';
import bcrypt from 'bcrypt';
import { getUserSchemaType, updateUserType } from '../api/schemas/user.schema';

const models = heliosDB.models

interface updateUserInterface  {
   (params:{data:any, filters:any, transaction?: Transaction}) : void
}

interface crateDataInterface {
    (params:{data:any, transaction?: Transaction}) : void
}

interface bulkCreateDataInterface {
     (params:{data:any[], options?: any ,transaction?: Transaction}) : void
}

export const createUser:crateDataInterface = async({data, transaction}) => {
    return await models.user_tbl.create(data,{
        transaction
    })
}

export const updateUser:updateUserInterface = async({data,filters,transaction}) => {

    return await models.user_tbl.update({
        ...data
    },
    {
        where:{
            ...filters
        },
        transaction
    })
}

export const getUser = async(filters: any) => {
    return await models.user_tbl.findOne({
        include: [
            {
                model: models.role_tbl,
                as: 'role'
            }
        ],  
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

export const getUsers = async (filters: getUserSchemaType) => {
    const { page, limit, search, ...where } = filters;

    const { rows, count } = await models.user_tbl.findAndCountAll({
        attributes: {
            exclude: ["password"],
            include: [
                [col("role.role_name"), "role_name"],
            ],
        },
        include: [
            { model: models.role_tbl, as: "role", attributes: []}
        ],
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

export const getUserById = async (id: string) => {
    return await models.user_tbl.findByPk(id);
}

export const updateUserById = async (id: string, payload: updateUserType) => {
    try {
        const [count] = await models.user_tbl.update(payload, { where: { id } });
        if (count > 0 ) {
            return await getUserById(id);
        }
    } catch (err: any) {
        throw new Error(err.message ? err.message : "Unable to update User")
    }

    throw new Error("Nothing to change")
}

export const passwordGenerator = async(length:number) => {
    let result = '';

    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    let counter = 0;
    while (counter < length) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
      counter += 1;
    }
    return result;
}

export const assignLocation:bulkCreateDataInterface = async({data,options,transaction}) => {
    return models.user_location_tbl.bulkCreate(data, {
        ...options,
        transaction
    })
}

export const validateAuth = async(params: {password:string; hashedPassword: string}) => {
    return bcrypt.compareSync(params.password,params.hashedPassword)
}

export const hashPassword = async(password:string) => {
    return bcrypt.hashSync(password, 10)
}
