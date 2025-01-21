// errorHandler.ts
import { Request, Response, NextFunction, ErrorRequestHandler } from "express";

class ApiError extends Error {
    statusCode: number;
    error: string;
    data: any;
    success: boolean;

    constructor(
        statusCode: number,
        error: string,
        message: string = 'Something went wrong...!',
        stack: string = '',
        data: any = null
    ) {
        super(message);
        this.statusCode = statusCode;
        this.data = data;
        this.success = false;
        this.error = error;

        if (stack) {
            this.stack = stack;
        } else {
            Error.captureStackTrace(this, this.constructor);
        }
    }
}


export const errorHandler = (err: any, req: Request, res: Response, next: NextFunction): void => {
    console.error('Error:', err.message || err);

    const statusCode = err.status || 500; 
    const message = err.message || 'Internal Server Error';
    if(message == "Invalid Token"){      
    res.clearCookie('accessToken', {httpOnly: true,secure: false,});
    res.clearCookie('refreshToken', {httpOnly: false,secure: false});
    }



    res.status(statusCode).json({
        success: false,
        message,
});
};

export { ApiError };