import { NextFunction, Request, Response } from 'express';
import * as roleRequestService from '../../../services/role.service';
import * as roleAccessRequestService from '../../../services/role-access.service';
import * as roleSchema from '../../schemas/role.schema';
import searchHelper from '../../../helpers/search.helper';

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

export const getRoles = async (req: Request, res: Response, next: NextFunction) => {
    try {
        //note to follow trip number, rud, delivery and br status
        const { page, limit, search, ...query }: roleSchema.getRoleType = roleSchema.getRoleSchema.parse(req.query)
        let filters: filterTypes = query;
        let newFilters: filterTypes = {};

        const searchFilter = searchHelper({
            search: search ?? '',
            fields: ['role_name']
        })

        Object.keys(filters).map((keys) => {
            const value = filters[keys]
            newFilters[keys] = value
        })

        const { rows, count, pageCount } = await roleRequestService.getRoles({
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

export const getRoleDetails = async (req: Request, res: Response, next: NextFunction) => {
    try {
        //note to follow trip number, rud, delivery and br status
        const { id } = roleSchema.roleIdSchema.parse(req.params);
        const data = await roleRequestService.getRoleById(id);
        const { rows } = await roleAccessRequestService.getAllRoleAccess({
            role_id: id,
            page: '0',
            limit: '50'
        })

        res.status(200).json({...data?.dataValues, modules: rows })
    }
    catch (e) {
        console.log(e);
        
        next(e)
    }
}

export const updateRoleDetails = async (req: Request, res: Response, next: NextFunction) => {
    try {
        //note to follow trip number, rud, delivery and br status
        const { id } = roleSchema.roleIdSchema.parse(req.params);
        const payload = roleSchema.updateRoleSchema.parse(req.body);

        let modules = payload.modules;
        delete payload.modules;

        const data = await roleRequestService.updateRoleById(id, payload);
        
        if (modules) {
            modules = modules.map((m) => ({ ...m, role_id: id }));
            await roleAccessRequestService.batchCreateUpdateRoleAccess(modules);
        }

        res.status(200).json(data)
    }
    catch (e) {
        next(e)
    }
}

export const createRole = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const payload = roleSchema.roleSchema.parse(req.body);

        if (payload.is_active === undefined) {
            payload.is_active = true;
        }
        if (payload.is_admin === undefined) {
            payload.is_admin = false;
        }

        let modules = payload.modules;
        delete payload.modules;

        const data = await roleRequestService.createRole(payload);
        if (modules && modules.length > 0) {
            modules = modules.map((m) => ({ ...m, role_id: data.dataValues.id }));
            await roleAccessRequestService.batchCreateUpdateRoleAccess(modules);
        }

        res.status(200).json(data)
    }
    catch (e) {
        next(e)
    }
}