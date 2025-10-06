import {Router} from 'express';
import {login,getSession, logout} from './auth.controller';
import authorizeMiddleware from '../../middleware/authorize.middleware';


const router = Router();

router.post('/login', login)
router.post('/logout', logout)

router.get('/session', authorizeMiddleware, getSession)

export default router;