import config from '../../configs';
import {Sequelize} from 'sequelize-typescript';
import path from 'path';

const sequelize = new Sequelize({
    dialect: 'mysql',
    host: config.db.host,
    username: config.db.username,
    password: config.db.password,
    database: config.db.database,
    logging: config.env === 'development',
    models: [path.join(__dirname, 'models/**/*.ts')],
    
})

export default sequelize;