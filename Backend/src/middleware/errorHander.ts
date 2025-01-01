import { Request, Response, NextFunction } from "express";


class ApiError extends Error{
    statusCode: number;
    error: string;
    data: any;
    success: boolean;

    constructor(statusCode: number, error: string, message : string = 'Something Went wrong...!', stack: string = '', data: any = null) {
        super(message)
        this.statusCode = statusCode
        this.data = data;
        this.success = false;
        this.error = error

        Error.captureStackTrace(this , this.constructor)
    }
}

export const errorHandle = (err: ApiError | Error, req: Request, res: Response, next: NextFunction) => {
    console.error(`[Error] : `, {
        message: err.message, 
        stack : err.stack
    })

    // If the error is an instance of ApiError, use its details
    if (err instanceof ApiError) {
        return res.status(err.statusCode).json({
        success: err.success,
        error: err.error,
        message: err.message,
        data: err.data,
        });
    }

    return res.status(500).json({
        success: false,
        error: "Internal Server Error",
        message: err.message || "Something Went Wrong",
        data: null,
    });
}

export { ApiError }