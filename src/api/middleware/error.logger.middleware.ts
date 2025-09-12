import { Request, Response, NextFunction } from "express";
import logger from '../../utils/logger';
import configs from '../../configs';

const errorLoggerMiddleware = async(err:Error, req: Request, res: Response, next: NextFunction) => {
     // Log the error with more detail, including the stack trace.
    logger.error(`Error occurred: ${err.message}`, {
        method: req.method,
        url: req.originalUrl,
        stack: err.stack
    });

    res.status(500).json({
        success: false,
        status: 500,
        message: err.message,
        stack: configs.env === 'development' ? err.stack : {} 
    })

    //Forward the error to the default Express error handler.
    //next(err);
}

export default errorLoggerMiddleware