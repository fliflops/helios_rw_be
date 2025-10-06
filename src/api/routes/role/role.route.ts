import {Router} from 'express';
import authorizeMiddleware from '../../middleware/authorize.middleware';
import * as roleController from './role.controller';

const router = Router();

router.get('/', authorizeMiddleware, roleController.getRoles)
router.post('/', authorizeMiddleware, roleController.createRole)
router.get('/access/:id', authorizeMiddleware, roleController.getRoleDetails)
router.put('/access/:id', authorizeMiddleware, roleController.updateRoleDetails)

export default router