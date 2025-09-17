import {Router} from 'express';
import * as shipPointController from './ship-point.controller';
import authorizeMiddleware from '../../../middleware/authorize.middleware';

const router = Router();

router.route('/')
.get(authorizeMiddleware,shipPointController.getShipPoints)


export default router;