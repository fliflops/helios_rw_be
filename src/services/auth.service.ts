import {v4 as uuid} from 'uuid';
import moment from 'moment';

import config from '../configs';
import redisClient from '../utils/redis';

const {
    prefix
} = config.redis

export const createSessionId = async() => {
    return uuid();
}

export const getSessionData = async(sessionId: string) => {
    const key = prefix+`session:${sessionId}`
    return await redisClient.get(key).then(result => !result ? null : JSON.parse(result))
}

export const getActiveSession = async(userId: string) => {
    const key = prefix+`active_session:${userId}`
    return await redisClient.get(key).then(result => !result ? null : JSON.parse(result))
}

export const extendRedisSession = async(params: {sessionId:string, expirySeconds:number}) => {
    const key = prefix+`session:${params.sessionId}`
    return await redisClient.expire(key,params.expirySeconds)
}

export const deleteActiveSession = async(userId: string) => {
    return await redisClient.del(`${prefix}active_session:${userId}`);
}

export const deleteSessionData = async(sessionId:string) => {
    const key = prefix+`session:${sessionId}`
    return await redisClient.del(key)
}

export const createSessionData = async (params: {sessionId:string, data:any, expirySeconds:number}) => {
    const key = prefix+`session:${params.sessionId}`;
    return await redisClient.setEx(
        key,
        params.expirySeconds,
        JSON.stringify(params.data)
    )   
}

export const createActiveSession = async(params: {
    userId:string
    sessionId:string
}) => {
    const key = prefix+`active_session:${params.userId}`
    return await redisClient.set(key, JSON.stringify({
        sessionId: params.sessionId,
        created_at: moment().format('YYYY-MM-DD HH:mm:ss')
    }))
}