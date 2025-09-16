import { NextFunction, Request, Response } from 'express';
import { createBarcodeSchema, createBarcodeType, getBarcodeSchema, getBarcodeSchemaType, getSortingCountSchema,getSortingCountType } from '../../schemas/sorting.schema';
import { createBarcode, generateBarcode, getPaginatedBarcodes } from '../../../services/sorting.service';
import {getBookingRequestCount} from '../../../services/booking-request.service';

import searchHelper from '../../../helpers/search.helper';
import heliosDB from '../../../database/helios';
import { Op } from 'sequelize';


interface controllerInterface {
    (req:Request, response: Response, next: NextFunction): void
}

export const getBarcodes:controllerInterface = async(req,res,next) => {
    try{
        const {page,limit, search, location, ...query}: getBarcodeSchemaType = getBarcodeSchema.parse(req.query);
        
        const searchFilter = searchHelper({
            search: search ?? '',
            fields: ['barcode', 'is_assigned', 'location']
        })

        const {rows,count,pageCount} = await getPaginatedBarcodes({
            page,
            limit,
            location: location ?? '',
            ...query,
            ...searchFilter
        })

        res.status(200).json({
            rows,
            count,
            pageCount:pageCount
        })

    }
    catch(e){
        next(e)
    }
}

export const createBarcodes: controllerInterface = async(req,res,next) => {
    const transaction = await heliosDB.transaction();
    try{
        const user = req.processor.id
        const {location,count}:createBarcodeType = createBarcodeSchema.parse(req.body);

        const barcodes = await generateBarcode({
            location,
            count
        })

        await createBarcode({
            barcodes,
            created_by: user,
            location
        }, )


        transaction.commit();
        res.end()
    }
    catch(e){
        await transaction.rollback();
        next(e)
        
    }    
}

export const getSortedInvoiceCount: controllerInterface = async(req,res,next) => {
    try{
        const query: getSortingCountType = getSortingCountSchema.parse(req.query);

        const data = await getBookingRequestCount({
            ...query,
            delivery_date: {
                [Op.between] :[query.delivery_date_from, query.delivery_date_to]
            }
        })

        res.status(200).json({
            invoice_count: data
        })
    }   
    catch(e){
        next(e)
    }
}

export const createPodSortingSession: controllerInterface = async(req,res,next) => {
    try{

    }
    catch(e){
        next(e)
    }
}