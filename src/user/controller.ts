import { NextFunction, type Request, type Response } from "express";
import {
    BadRequest,
    ConflictError,
    NotFoundError,
    UnauthorizedError,
} from "../utils/apiError.js";
import {
    SetNewPasswordBodyPayload,
    SignUpBodyPayload,
} from "../types/request-body.type.js";

import { userService } from "./service.js";

export async function signUp(
    request: Request<{}, {}, SignUpBodyPayload>,
    response: Response,
    next: NextFunction
) {
    if (request.user) {
        return next(
            new ConflictError(
                "User with this email address already exists. Please use a different email or log in."
            )
        );
    }

    try {
        await userService.createNewUser(request.body);

        response.status(201).json({
            success: true,
            message: "A new user has been created",
            data: {
                email: request.body.email,
                name: request.body.name,
            },
        });
    } catch (error) {
        console.error("Error adding data to db ", { cause: error.message });

        next(new BadRequest());
    }
}

export async function signIn(request: Request, response: Response, next) {
    if (!request.user) {
        return next(new UnauthorizedError("Wrong email or password"));
    }

    try {
        const accessToken = await userService.signInUser(
            request.user,
            request.body
        );

        response.status(201).json({
            success: true,
            message: "User logged in",
            data: {
                accessToken,
            },
        });
    } catch (error) {
        console.error(new Error("Error occures ", { cause: error.message }));

        if (error instanceof UnauthorizedError) next(error);

        next(new BadRequest());
    }
}

export async function setNewPassword(
    request: Request<{}, {}, SetNewPasswordBodyPayload>,
    response: Response,
    next
) {
    if (!request.user) {
        return next(new NotFoundError("User doesnt exists"));
    }

    try {
        await userService.setNewPassword(request);

        response.status(201).json({
            success: true,
            message: "Password has been changed succesful",
        });
    } catch (error) {
        console.error(new Error("Error occures ", { cause: error.message }));

        next(new BadRequest());
    }
}
