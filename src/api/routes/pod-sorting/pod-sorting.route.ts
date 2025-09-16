import {Router} from 'express';
import authorizeMiddleware from '../../middleware/authorize.middleware';
import { createBarcodes, createPodSortingSession, getBarcodes, getSortedInvoiceCount } from './pod-sorting.controller';

const router = Router();

router.route('/')
.get(authorizeMiddleware, getSortedInvoiceCount)
.post(authorizeMiddleware, createPodSortingSession)

router.route('/barcode')
.get(authorizeMiddleware, getBarcodes)
.post(authorizeMiddleware,createBarcodes)

export default router;