import { type NextFunction, type Request, type Response } from "express";
import { validationResult } from "express-validator";

export const validateRequest = (
    request: Request,
    response: Response,
    next: NextFunction
) => {
    const errors = validationResult(request);

    if (!errors.isEmpty()) {
        return response.status(400).json({
            success: false,
            message: "Validation failed",
            errors: errors.array(),
        });
    }

    next();
};
