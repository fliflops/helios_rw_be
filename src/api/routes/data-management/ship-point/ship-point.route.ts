import { Router } from 'express';
import * as shipPointController from './ship-point.controller';
import authorizeMiddleware from '../../../middleware/authorize.middleware';

const router = Router();

router.get('/', authorizeMiddleware, shipPointController.getShipPoints)
router.post('/', authorizeMiddleware, shipPointController.createShipPoint)
router.get('/details/:id', authorizeMiddleware, shipPointController.getShipPointDetails)
router.put('/details/:id', authorizeMiddleware, shipPointController.updateShipPointDetails)

export default router;