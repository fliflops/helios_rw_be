import { NextFunction, Request, Response } from 'express';
import * as userRequestService from '../../../services/user.service';
import * as userSchema from '../../schemas/user.schema';
import searchHelper from '../../../helpers/search.helper';
import sendMail from '../../../helpers/email.helper';

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

export const getUsers = async (req: Request, res: Response, next: NextFunction) => {
    try {
        //note to follow trip number, rud, delivery and br status
        const { page, limit, search, ...query }: userSchema.getUserSchemaType = userSchema.getUserSchema.parse(req.query)
        let filters: filterTypes = query;
        let newFilters: filterTypes = {};

        const searchFilter = searchHelper({
            search: search ?? '',
            fields: ['email', 'first_name', 'last_name']
        })

        Object.keys(filters).map((keys) => {
            const value = filters[keys]
            newFilters[keys] = value
        })

        const { rows, count, pageCount } = await userRequestService.getUsers({
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

export const getUserDetails = async (req: Request, res: Response, next: NextFunction) => {
    try {
        //note to follow trip number, rud, delivery and br status
        const { id } = userSchema.userIdSchema.parse(req.params);
        const data = await userRequestService.getUserById(id);

        res.status(200).json(data)
    }
    catch (e) {
        next(e)
    }
}

export const updateUserDetails = async (req: Request, res: Response, next: NextFunction) => {
    try {
        //note to follow trip number, rud, delivery and br status
        const { id } = userSchema.userIdSchema.parse(req.params);
        const payload = userSchema.updateUserSchema.parse(req.body);

        const data = await userRequestService.updateUserById(id, payload);

        res.status(200).json(data)
    }
    catch (e) {
        next(e)
    }
}

export const createUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const payload = userSchema.createUserSchema.parse(req.body);
        const tempPassword = await userRequestService.passwordGenerator(14);

        if (payload.is_active === undefined) {
            payload.is_active = true;
        }
        if (payload.is_new === undefined) {
            payload.is_new = true;
        }
        if (payload.is_lock === undefined) {
            payload.is_lock = false;
        }
        if (payload.is_reset === undefined) {
            payload.is_reset = false;
        }

        payload.password = await userRequestService.hashPassword(tempPassword);
        const data = userRequestService.createUser({ data: payload });

        await sendMail({
            password: tempPassword,
            email: payload.email,
            first_name: payload.first_name ?? 'User',
        });

        res.status(200).json(data)
    }
    catch (e) {
        next(e)
    }
}

export const resetPassword = async (req: Request, res: Response, next: NextFunction) => {
    try {

        const { id } = userSchema.userIdSchema.parse(req.params);
        const tempPassword = await userRequestService.passwordGenerator(14);

        const user = await userRequestService.getUserById(id);
        if (!user) return res.status(404).json({ message: "User not found" });

        console.log({ user });

        await sendMail({
            password: tempPassword,
            email: user.dataValues.email,
            first_name: user.dataValues.first_name ?? 'User',
            subject: '[Helios: Reset Password]'
        });
        const password = await userRequestService.hashPassword(tempPassword);

        await userRequestService.updateUserById(id, {
            password,
            is_reset: true,
        });

        res.status(200).json({ message: "A temporary password has been sent to the email" })
    }
    catch (e) {
        next(e)
    }
}