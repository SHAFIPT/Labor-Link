import Joi from "joi";
import { Request, Response, NextFunction } from "express";
import { ApiError } from "../middleware/errorHander";

const userRegistration = Joi.object({
    email: Joi.string().min(6).max(50).email().required(),
    name: Joi.string().pattern(/^[a-zA-Z]*$/).min(6).max(50).required(),
    password: Joi.string().min(6).required()
});

const userLoginSchema = Joi.object({
    email: Joi.string().min(6).max(50).email().required(),
    password: Joi.string().min(6).required(),
});

export function validateRegistration(req: Request, res: Response, next: NextFunction): void {
    const { error } = userRegistration.validate(req.body.user, { abortEarly: false });

    if (error) {
        // Instead of directly returning a Response, call `next()` with an error
        return next(new ApiError(400, 'Validation Error', JSON.stringify(error.details)));
    }

    next(); 
}
