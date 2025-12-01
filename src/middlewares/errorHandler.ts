import { NextFunction, Request, Response } from "express";
import { ApiError } from "../errors/apiError.js";

type CustomError = ApiError | Error;

const errororHandler = (
    error: CustomError,
    request: Request,
    response: Response,
    next: NextFunction
) => {
    const statusCode = error instanceof ApiError ? error.status : 500;

    if (process.env.NODE_ENV === "development") {
        console.error(`[${statusCode} ERROR] ${error.name}: ${error.message}`);
    } else {
        // Only log critical server errors in production
        if (statusCode === 500) {
            console.error("SERVER ERROR:", error.message);
        }
    }

    response.status(statusCode).json({
        success: false,
        status: statusCode,
        message: error.message || "An unexpected error occurred.",
        stack: process.env.NODE_ENV === "development" ? error.stack : undefined,
    });
};

export default errororHandler;
