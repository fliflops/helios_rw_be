import { Transaction } from 'sequelize';
import heliosDB from '../database/helios';
import bcrypt from 'bcrypt';

const models = heliosDB.models

interface updateUserInterface  {
   (params:{data:any, filters:any, transaction?: Transaction}) : void
}

interface crateDataInterface {
    (params:{data:any, transaction: Transaction}) : void
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

export const hasPassword = async(password:string) => {
    return bcrypt.hashSync(password, 10)
}
