import express, { Request, Response, NextFunction } from 'express';
import logger from '../../utils/logger'

const apiLogger = async(req: Request,res: Response,next: NextFunction) => {
     // Log the incoming request method and URL.
  logger.info(`Incoming request: ${req.method} ${req.originalUrl}`);

  // We can also add a listener for when the response is finished to log the status code.
  res.on('finish', () => {
    logger.info(`Request finished: ${req.method} ${req.originalUrl} - Status: ${res.statusCode}`);
  });

  // Call the next middleware function in the stack.
  next();
}

export default apiLogger