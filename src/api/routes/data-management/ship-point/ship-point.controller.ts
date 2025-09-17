import { NextFunction, Request, Response } from 'express';
import * as shipPointRequestService from '../../../../services/ship-point.service';
import * as shipPointSchema from '../../../schemas/ship-point.schema';
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

export const getShipPoints = async (req: Request, res: Response, next: NextFunction) => {
    try {
        //note to follow trip number, rud, delivery and br status
        const { page, limit, search, ...query }: shipPointSchema.getShipPointSchemaType = shipPointSchema.getShipPointSchema.parse(req.query)
        let filters: filterTypes = query;
        let newFilters: filterTypes = {};

        const searchFilter = searchHelper({
            search: search ?? '',
            fields: ['ship_point_code', 'ship_point_desc', 'ship_point_address']
        })

        Object.keys(filters).map((keys) => {
            const value = filters[keys]
            newFilters[keys] = value
        })


        const { rows, count, pageCount } = await shipPointRequestService.getShipPoints({
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