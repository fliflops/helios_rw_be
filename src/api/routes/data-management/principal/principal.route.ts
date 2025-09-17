import { Router } from 'express';
import * as principalController from './principal.controller';
import authorizeMiddleware from '../../../middleware/authorize.middleware';

const router = Router();

router.get('/', authorizeMiddleware, principalController.getPrincipals)

router.get('/details/:id', authorizeMiddleware, principalController.getPrincipalDetails)

export default router;