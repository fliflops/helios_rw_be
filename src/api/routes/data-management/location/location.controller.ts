import { NextFunction, Request, Response } from 'express';
import * as locationRequestService from '../../../../services/location.service';
import * as locationSchema from '../../../schemas/location.schema';
import { Op } from 'sequelize';
import searchHelper from '../../../../helpers/search.helper';

interface controllerInterface {
    (req: Request, response: Response, next: NextFunction): void
}

type paginationParameters = {
    page: number;
    totalPage: number;
    search: string;
}

type filterTypes = {
    [key: string]: string | any
}

export const getLocations = async (req: Request, res: Response, next: NextFunction) => {
    try {
        //note to follow trip number, rud, delivery and br status
        const { page, limit, search, ...query }: locationSchema.getLocationSchemaType = locationSchema.getLocationSchema.parse(req.query)
        let filters: filterTypes = query;
        let newFilters: filterTypes = {};

        const searchFilter = searchHelper({
            search: search ?? '',
            fields: ['loc_code', 'loc_name']
        })

        Object.keys(filters).map((keys) => {
            const value = filters[keys]
            newFilters[keys] = value
        })


        const { rows, count, pageCount } = await locationRequestService.getLocations({
            page, limit, search,
            ...newFilters,
            ...searchFilter
        });

        res.status(200).json({
            rows,
            count,
            pageCount
        })
    }
    catch (e) {
        next(e)
    }
}


export const getLocationDetails = async (req: Request, res: Response, next: NextFunction) => {
    try {
        //note to follow trip number, rud, delivery and br status
        const { id } = locationSchema.locationIdSchema.parse(req.params);
        const data = await locationRequestService.getLocationById(id);

        res.status(200).json(data)
    }
    catch (e) {
        next(e)
    }
}