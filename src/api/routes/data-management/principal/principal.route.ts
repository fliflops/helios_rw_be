import { Router } from 'express';
import * as principalController from './principal.controller';
import authorizeMiddleware from '../../../middleware/authorize.middleware';

const router = Router();

router.get('/', authorizeMiddleware, principalController.getPrincipals)
router.post('/', authorizeMiddleware, principalController.createPrincipal)
router.get('/details/:id', authorizeMiddleware, principalController.getPrincipalDetails)
router.put('/details/:id', authorizeMiddleware, principalController.updatePrincipalDetails)

export default router;