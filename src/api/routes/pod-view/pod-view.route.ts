import {Router} from 'express';
import * as podViewController from './pod-view.controller';
import authorizeMiddleware from '../../middleware/authorize.middleware';

const router = Router();


router.route('/')
.get(authorizeMiddleware,podViewController.getPods)


export default router;