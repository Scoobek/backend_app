import { NextFunction, Request, Response } from "express";
import { ApiError } from "../utils/apiError.js";

type CustomError = ApiError | Error;

const errororHandler = (
    error: CustomError,
    request: Request,
    response: Response
) => {
    const statusCode = error instanceof ApiError ? error.status : 500;

    console.error(`[${statusCode} ERROR] ${error.name}: ${error.message}`);

    response.status(statusCode).json({
        success: false,
        status: statusCode,
        message: error.message || "An unexpected error occurred.",
        stack: process.env.NODE_ENV === "development" ? error.stack : undefined,
    });
};

export default errororHandler;
