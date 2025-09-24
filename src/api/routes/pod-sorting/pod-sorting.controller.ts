import { NextFunction, Request, Response } from 'express';
import { assignBarcodeSchema, assignBarcodeType, createBarcodeSchema, createBarcodeType, getAllPodSchema, getAllPodType, getBarcodeSchema, getBarcodeSchemaType, getPodSchema, getPodType, getSortingCountSchema,getSortingCountType } from '../../schemas/sorting.schema';
import { createBarcode, generateBarcode, getPaginatedBarcodes, createSortingSession, getSortingSession, cancelSortingSession, getAllSortingSessionDetails, getSortingDetails, updateSortingDetail, getBarcode, getAllBarcodes, updateSortingTable  } from '../../../services/sorting.service';
import { getBookingRequestCount, getBookingRequests} from '../../../services/booking-request.service';

import searchHelper from '../../../helpers/search.helper';
import heliosDB from '../../../database/helios';
import { Op } from 'sequelize';
import createHttpError from 'http-errors';


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
        const {delivery_date_from,delivery_date_to,...query}: getSortingCountType = getSortingCountSchema.parse(req.query);

        const data = await getBookingRequestCount({
            ...query,
            delivery_date: {
                [Op.between] :[delivery_date_from, delivery_date_to]
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
        const {delivery_date_from,delivery_date_to,...query}: getSortingCountType = getSortingCountSchema.parse(req.body);
        const user = req.processor.id
        const invoices = await getBookingRequests({
            ...query,
            delivery_date: {
                [Op.between] :[delivery_date_from, delivery_date_to]
            }
        })
     
        await createSortingSession({
            header: {
                ...query,
                user_id:user,
                delivery_date_from,
                delivery_date_to
            },
            details:invoices.map((item: {
                id: string;
                br_no:string;
                invoice_no:string;
                dr_no: string;
                service_type:string;
                shipment_manifest:string;
                ship_to_code:string;
                user_id: string;
                delivery_date:string;
            }) => {
                return {
                    id: item.id,
                    br_no:item.br_no,
                    invoice_no:item.invoice_no,
                    dr_no: item.dr_no,
                    service_type:item.service_type,
                    shipment_manifest:item.shipment_manifest,
                    ship_to_code:item.ship_to_code,
                    delivery_date: item.delivery_date,
                    user_id: user
                }
            })
        })

        res.end();
    }
    catch(e){
        next(e)
    }
}

export const getPodSortingSession: controllerInterface = async(req,res,next) => {
    try{
        const id = req.processor.id;

        const sortingSession = await getSortingSession(id);

        if(!sortingSession) return res.status(200).json(null)

        res.status(200).json({
            ...sortingSession,
            user: id  
        })
    }
    catch(e){
        next(e)
    }
}

export const cancelPODSortingSession: controllerInterface = async(req,res,next) => {
    try{
        const id = req.processor.id;

        await cancelSortingSession({user_id: id})

        res.end();

    }
    catch(e){
        next(e)
    }
}

export const getPod: controllerInterface = async(req,res,next) => {
    try{
        const user = req.processor.id;
        const body:getPodType = getPodSchema.parse(req.body)
        const data = await getAllSortingSessionDetails({user_id:user});
        const pattern = new RegExp((body.invoice_no || body.dr_no) as string)
        
        const result = data.filter(item => {
            if(body.invoice_no) return pattern.test(item.data.invoice_no)
            return pattern.test(item.data.dr_no)
        })

        res.status(200).json(result.filter(item => !item.data.is_assigned));
    }
    catch(e){
        next(e)
    }
}

export const getAllPOD: controllerInterface = async(req,res,next) => {
    try{
        const user = req.processor.id;
        const {is_assigned}: getAllPodType = getAllPodSchema.parse(req.query)

        const data = await getAllSortingSessionDetails({user_id:user});
        
        res.status(200).json(data.map(item => item.data).filter(item => item.is_assigned === Boolean(is_assigned)));
    }
    catch(e){
        next(e)
    }
}

export const assignPodBarcode: controllerInterface = async(req,res,next) => {
    try{
        const user = req.processor.id;
        const sortingSession = await getSortingSession(user);
        const sortingSessionDetails = await getAllSortingSessionDetails({user_id: user})
       
        const {barcode,key}:assignBarcodeType = assignBarcodeSchema.parse(req.body)
        
        //validate barcode;
        const barcodeData = await getBarcode({
            barcode
        })

        //validation for already used barcode in session
        if(sortingSessionDetails.find(item => item.data.barcode === barcode)) throw createHttpError(400, 'Barcode is already assigned')

        if(!barcodeData) throw createHttpError(400, 'Invalid Barcode');

        if(barcodeData.is_assigned) throw createHttpError(400, 'Barcode is already assigned')

        if(String(sortingSession?.location_code).toLowerCase() !== barcodeData.location.toLowerCase()) throw createHttpError(400, 'Invoice and Barcode location does not match')
        
        const pod = sortingSessionDetails.find(item => item.key === key);


        if(!pod) throw createHttpError(400, 'Invoice is not in sorting session');

        //update sorting data 
        await updateSortingDetail({
            key,
            data:{
                ...pod.data,
                is_assigned:true,
                barcode
            }
        })

        res.end();
    }
    catch(e){
        next(e)
    }
}

export const confirmSorting: controllerInterface = async(req,res, next) => {
    try{
        const id = req.processor.id;

        let details = await getAllSortingSessionDetails({user_id: id});
        details = details.filter(item => item.data.is_assigned)
        
        //validate barcode data
        const assignedBarcodes = details.map(item => item.data.barcode);

        //check if barcode is already assigned
        const getBarcodes = await getAllBarcodes({
            barcode: assignedBarcodes,
            is_assigned: true
        })

        //get the final result
        const result = details.filter(item =>  !getBarcodes.map(a => a.barcode).includes(item.data.barcode));


        // //update sorting table
        // await updateSortingTable({
        //     data:
        // })

        res.status(200).json(result)
    }
    catch(e){
        next(e)
    }
}