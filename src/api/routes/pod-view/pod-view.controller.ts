import { NextFunction, Request, Response } from 'express';
import * as bookingRequestService from '../../../services/booking-request.service';
import * as podSchema from '../../schemas/view-pod.schemas';
import { Op } from 'sequelize';
import searchHelper from '../../../helpers/search.helper';


interface controllerInterface {
    (req:Request, response: Response, next: NextFunction): void
}

type paginationParameters = {
    page: number;
    totalPage: number;
    search: string;
}

type filterTypes = {
    [key: string]: string | any
}

export const getPods = async(req: Request,res: Response,next:NextFunction) => {
    try{
        //note to follow trip number, rud, delivery and br status
        const {page, limit,search,location_code,...query}:podSchema.getPODSChemaType = podSchema.getPODSchema.parse(req.query)
        let filters: filterTypes = query;
        let newFilters: filterTypes = {};

        const searchFilter = searchHelper({
            search: search ?? '',
            fields: ['br_no', 'service_type', 'dr_no','shipment_manifest','invoice_no','reason_code','ship_from','sub_service_type']
        })
        
        Object.keys(filters).map((keys ) => {
            const value = filters[keys]

            if(keys === 'delivery_date_from' || keys === 'delivery_date_to') {
                newFilters['delivery_date'] = {
                    [Op.between] : [filters['delivery_date_from'], filters['delivery_date_to']]
                }
            }

            if(['ship_to_code', 'principal'].includes(keys)){
                newFilters[keys] = value
            }
        })


        const {rows,count, pageCount} = await bookingRequestService.getPaginatedBookingRequest({
            page, limit,search,
            location_code: location_code ?? '',
            ...newFilters,
            ...searchFilter
        });

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