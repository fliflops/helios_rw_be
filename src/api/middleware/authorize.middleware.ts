import jwt, { JwtPayload } from 'jsonwebtoken';
import httpStatus from 'http-status';
import createHttpError from 'http-errors';
import { NextFunction, Request, Response } from 'express';
import configs from '../../configs';
import { extendRedisSession, getActiveSession, getSessionData } from '../../services/auth.service';

export default async(req:Request, res: Response, next: NextFunction) => {
    try{
        
        const token = req.headers['x-access-token'] as string;
    
        if(!token) throw createHttpError(401,'Access Denied: Invalid Token');

        jwt.verify(token, configs.jwt_secret, async(error, decodedToken)=> {
            try{
                if(error) {
                    throw createHttpError(403,'Access Denied: Invalid Token')
                }

                const decodedPayload  = decodedToken as {session_id: string};

                //get session id from the decoded  token
                const sessionId = decodedPayload.session_id;
                if(!sessionId) throw createHttpError(403, 'Access Denied: Session ID missing from token');
                
                //get session data using session id
                const sessionData = await getSessionData(sessionId)
                if(!sessionData) throw createHttpError(403, 'Access Denied: Session ID is invalid')
                const userId = sessionData.user.id;

                //validate if there's another active session per user id
                const activeSession = await getActiveSession(userId);
                if(!activeSession) throw createHttpError(400, 'No session found')

                if(sessionId !== activeSession.sessionId) throw createHttpError(403, 'Access Denied: Another session is active for this account.')
                await extendRedisSession({
                    sessionId,
                    expirySeconds:3600   //1 hour 
                });

                //extend redis session per access
                req.processor = {
                    id: userId               
                }
                
                return next();
            
            }
            catch(e){
                next(e)
            }
        })

    }
    catch(e){
        next(e)
    }
}
