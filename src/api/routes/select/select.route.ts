import {Router} from 'express';
import * as selectController from './select.controller';
import authorizeMiddleware from '../../middleware/authorize.middleware';

const router = Router()

router.get('/user-location', authorizeMiddleware,selectController.getUserLocations)
router.get('/ship-point', authorizeMiddleware, selectController.getShipPoints)
router.get('/principal', authorizeMiddleware, selectController.getPrincipals)
router.get('/service-type', authorizeMiddleware, selectController.getServiceTypes)

export default router;




