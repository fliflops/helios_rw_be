import { NextFunction,Response, Request } from "express";
import {getUser, validateAuth} from '../../../services/user.service';
import { createActiveSession, createSessionData, createSessionId, deleteActiveSession, getActiveSession, getSessionData, deleteSessionData } from '../../../services/auth.service';
import createHttpError from 'http-errors';
import moment from "moment";
import jwt from'jsonwebtoken';
import configs from "../../../configs";

export const login = async(req: Request, res: Response, next: NextFunction) => {
    const error = 'Invalid username or password.'
    //Login Steps
    //1. Validate email and password
    //2. Generate Session id
    //3. Invalidate the old session id 
    //4. Create new Session 
    //5. Generate JWT for extra security
    //6. add session id and token in the response

    //Notes:
    //Session id will be encoded inside the token 
    //The session id will be used for retrieval of session data in redis.
    try{
        const {email, password} = req.body;
        const user = await getUser({
            email,
            is_active: 1
        });

        if(!user)       throw createHttpError(400, error);
        if(!user.role)  throw createHttpError(401, 'No assigned Role.');

        console.log(user)
        
        const passwordMatch = await validateAuth({
            password: password,
            hashedPassword: user.password
        });

        if(!passwordMatch) throw createHttpError(400, error);
        if(user.is_lock) throw createHttpError(400, 'Account is locked.');
        
        //generate session id
        const sessionId = await createSessionId();
        //validate if there's an active session per user account
        const oldSession = await getActiveSession(user.id);
        //invalidate the old session
        if(oldSession) await deleteActiveSession(user.id);
        
        //Create user session data and insert to redis per session id
        await createSessionData({
            sessionId,
            expirySeconds: (24 * 3600), //24 hours,
            data: {
                session_id: sessionId,
                created_at: moment().format('YYYY-MM-DD HH:mm:ss'),
                user: {
                    id:         user.id,
                    email:      user.email,
                    role_id:    user.role.id,
                    role_name:  user.role.role_name,
                    is_admin:   user.role.is_admin,
                    role_status: user.role.is_active ? 'ACTIVE' : 'INACTIVE',
                    password_expiry:    user.password_expiry,
                    is_lock:            user.is_lock,
                    is_new:             user.is_new,
                    is_reset:           user.is_reset,
                    routes:             []
                }
            }
        })

        //create new active session data 
        await createActiveSession({
            sessionId,
            userId: user.id
        });
    
        const token = jwt.sign({session_id: sessionId}, configs.jwt_secret, {expiresIn: '1h'})

        res.status(200).json({
            token
        });
                
    }
    catch(e){
        next(e)
    }
}

export const getSession = async(req:Request,res:Response,next:NextFunction) => {
    try{
        const token = req.headers['x-access-token'] as string;
        const decodeToken = jwt.verify(token, configs.jwt_secret) as {session_id:string};
        const sessionId = decodeToken.session_id;
        
        const {user} = await getSessionData(sessionId);
        console.log(user)

        //to follow
       // const role = await getRedisRole(user.role_id);


        return res.status(200).json({
            id: user.id,
            email: user.email,
            is_new: user.is_new,
            is_reset: user.is_reset,
            is_lock: user.is_lock,
            role: {
                role_id:    user.role_id,
                role_name:  user.role_name,
                is_admin:   user.is_admin,
            },
            access: []
        })
    }
    catch(e){
        next(e)
    }
}

export const logout = async(req: Request, res: Response, next: NextFunction) => {
    try{

        const token = req.headers['x-access-token'] as string;
        if(!token) return res.end(); //throw createHttpError(400, 'Access Denied: No Access Token');
        const userId = req.processor.id;
        const decodeToken = jwt.verify(token, configs.jwt_secret) as {session_id:string};
        const sessionId = decodeToken.session_id;
        
          //Delete session data from redis
        await deleteSessionData(sessionId);
        
        //Clear active session from redis
        await deleteActiveSession(userId);

        res.end();

    }
    catch(e){
        next(e)
    }
}