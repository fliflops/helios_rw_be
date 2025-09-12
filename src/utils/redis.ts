import * as Redis from 'redis';
import config from '../configs';

export default Redis.createClient({
    socket:{
        host: config.redis.host,
        port: Number(config.redis.port)            
    }
})