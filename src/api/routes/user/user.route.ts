import {Router} from 'express';
import authorizeMiddleware from '../../middleware/authorize.middleware';
import * as userController from './user.controller';

const router = Router();

router.get('/', authorizeMiddleware, userController.getUsers)
router.post('/', authorizeMiddleware, userController.createUser)
router.get('/details/:id', authorizeMiddleware, userController.getUserDetails)
router.put('/details/:id', authorizeMiddleware, userController.updateUserDetails)
router.put('/reset-password/:id', authorizeMiddleware, userController.resetPassword)

export default router