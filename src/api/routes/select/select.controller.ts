import { NextFunction, Request, Response } from 'express';
import * as locationService from '../../../services/location.service';
import * as ShipPointService from '../../../services/ship-point.service';
import * as PrincipalService from '../../../services/principal.service';

interface controllerInterface {
    (req:Request, response: Response, next: NextFunction): void
}

type selectResponseType = {
    label: string;
    value: string;
}

export const getUserLocations:controllerInterface = async(req,res,next) => {
    try{
        const user = req.processor.id;

        const data = await locationService.getUserLocations({
            user_id: user,
            is_active: true
        })
        
        res.status(200).json(data.map((item:any) => {
            return {
                label: item.location.loc_name,
                value: item.loc_code
            }
        }));
    }   
    catch(e){
        next(e)
    }
}

export const getShipPoints:controllerInterface = async(req,res,next) => {
    try{
        const data = await ShipPointService.getShipPoints({
            is_active:1
        })

        res.status(200).json(data.map((item:any) => {
            return {
                label: item.ship_point_code+'-'+item.ship_point_desc,
                value: item.ship_point_code
            }
        }));

    }
    catch(e){
        next(e)
    }
}

export const getPrincipals: controllerInterface = async(req,res,next) => {
    try{
        const data = await PrincipalService.getPrincipals({
            is_active: 1
        })

        res.status(200).json(data.map((item:any) => {
            return {
                label: item.customer_code+'-'+item.customer_name,
                value: item.customer_code
            }
        }));
    }   
    catch(e){
        next(e)
    }
}