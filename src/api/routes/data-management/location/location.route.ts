import { Router } from 'express';
import * as locationController from './location.controller';
import authorizeMiddleware from '../../../middleware/authorize.middleware';

const router = Router();

router.get('/', authorizeMiddleware, locationController.getLocations)
router.get('/details/:id', authorizeMiddleware, locationController.getLocationDetails)
router.put('/details/:id', authorizeMiddleware, locationController.updateLocationDetails)

export default router;