import {Router} from 'express';
import authorizeMiddleware from '../../middleware/authorize.middleware';
import { createBarcodes, getBarcodes } from './pod-sorting.controller';

const router = Router();

router.route('/barcode')
.get(authorizeMiddleware, getBarcodes)
.post(authorizeMiddleware,createBarcodes)

export default router;