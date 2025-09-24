import {Router} from 'express';
import authorizeMiddleware from '../../middleware/authorize.middleware';
import { assignPodBarcode, cancelPODSortingSession, confirmSorting, createBarcodes, createPodSortingSession, getAllPOD, getBarcodes, getPod, getPodSortingSession, getSortedInvoiceCount } from './pod-sorting.controller';

const router = Router();

router.route('/')
.get(authorizeMiddleware, getSortedInvoiceCount)
.post(authorizeMiddleware, createPodSortingSession)

router.route('/session')
.get(authorizeMiddleware, getPodSortingSession)
.put(authorizeMiddleware, cancelPODSortingSession)
.post(authorizeMiddleware, confirmSorting)

router.route('/pod')
.put(authorizeMiddleware, assignPodBarcode)
.post(authorizeMiddleware, getPod)
.get(authorizeMiddleware, getAllPOD)

router.route('/barcode')
.get(authorizeMiddleware, getBarcodes)
.post(authorizeMiddleware,createBarcodes)



export default router;