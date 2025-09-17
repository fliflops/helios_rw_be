import {Router} from 'express';
import * as locationController from './location.controller';
import authorizeMiddleware from '../../../middleware/authorize.middleware';

const router = Router();

router.route('/')
.get(authorizeMiddleware,locationController.getLocations)


export default router;