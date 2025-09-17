import { NextFunction, Request, Response } from 'express';
import * as principalRequestService from '../../../../services/principal.service';
import * as principalSchema from '../../../schemas/principal.schema';
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

export const getPrincipals = async (req: Request, res: Response, next: NextFunction) => {
    try {
        //note to follow trip number, rud, delivery and br status
        const { page, limit, search, ...query }: principalSchema.getPrincipalSchemaType = principalSchema.getPrincipalSchema.parse(req.query)
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


        const { rows, count, pageCount } = await principalRequestService.getPrincipals({
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

export const getPrincipalDetails = async (req: Request, res: Response, next: NextFunction) => {
    try {
        //note to follow trip number, rud, delivery and br status
        const { id } = principalSchema.principalIdSchema.parse(req.params);
        const data = await principalRequestService.getPrincipalById(id);

        res.status(200).json(data)
    }
    catch (e) {
        next(e)
    }
}