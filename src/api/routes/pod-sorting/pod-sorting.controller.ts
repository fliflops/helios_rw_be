import { NextFunction, Request, Response } from 'express';
import { createBarcodeSchema, createBarcodeType, getBarcodeSchema, getBarcodeSchemaType } from '../../schemas/sorting.schema';
import { createBarcode, generateBarcode, getPaginatedBarcodes } from '../../../services/sorting.service';

import searchHelper from '../../../helpers/search.helper';
import heliosDB from '../../../database/helios';


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
            //search
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