import { Request, Response, NextFunction } from 'express';
import {ZodError, ZodAny, z } from 'zod';
import httpcodes from 'http-status';
import createHttpError from 'http-errors';

// export async function zParse<T extends ZodAny>(
//   schema: T,
//   req: Request
// ): Promise<z.infer<T>> {
//   try {
//     return schema.parseAsync(req);
//   } catch (error) {
//     if (error instanceof ZodError) {
//       throw createHttpError(httpcodes.INTERNAL_SERVER_ERROR,error.message);
//     }

//     return httpcodes.BAD_REQUEST
//     //throw createHttpError(httpcodes.BAD_REQUEST, error)
//   }
// }


// export const validateQuery = (schema: z.ZodObject<any,any>) => {
//     return (req:Request, res: Response, next: NextFunction) => {
//         try{
//             schema.parse(req.query);
//             next()
//         }
//         catch(error){
//             if (error instanceof ZodError) {
//                 const errorMessages = error.issues.map((issue: any) => ({
//                     message: `${issue.path.join('.')} is ${issue.message}`,
//                 }))

//                 return res.status(httpcodes.BAD_REQUEST).json({
//                     error: 'Invalid Data',
//                     details: errorMessages
//                 })

//              } 
//             else {
//                 res.status(httpcodes.INTERNAL_SERVER_ERROR).json({ error: 'Internal Server Error' });
//             }
//         }
//     }
// }
