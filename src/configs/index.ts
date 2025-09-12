import dotenv from 'dotenv';

dotenv.config();

export default {
    env: process.env.NODE_ENV,
    jwt_secret: process.env.JWT_SECRET as string,
    rabbitmq: {
        url: `amqp://${process.env.RABBITMQ_USER}:${process.env.RABBITMQ_PASS}@${process.env.RABBITMQ_HOST}:${process.env.RABBITMQ_PORT}`
    },
    redis:{
        prefix: 'helios:',
        port: process.env.REDIS_PORT,
        host: process.env.REDIS_URL  
    },
    db: {
        host:       process.env.DB_HOST,
        username:   process.env.DB_USER,
        password:   process.env.DB_PASSWORD,
        dialect:    'mysql',
        database:   process.env.DB_NAME,
        // logging: false,
        // pool:{
        //     max: 10,
        //     min: 1,
        //     idle: 2000000,
        //     acquire: 2000000
        // },
        // dialectOptions: {
        //     //useUTC: false, //for reading from database
        //     dateStrings: true,
        //     typeCast: true
        // },
        // timezone: '+08:00' /**for writing to database**/,
        // // define:{
        // //     version:true
        // // }

    }   
}