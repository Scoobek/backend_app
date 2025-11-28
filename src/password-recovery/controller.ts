import { type Request, type Response } from "express";

import {
    PasswordRecoveryAuthBodyPayload,
    PasswordRecoveryLinkBodyPayload,
} from "../types/request-body.type.js";

import { BadRequest, ConflictError, NotFoundError } from "../utils/apiError.js";

import { passwordRecoveryService } from "./services.js";

export async function passwordRecoveryLink(
    request: Request<{}, {}, PasswordRecoveryLinkBodyPayload>,
    response: Response,
    next
) {
    if (!request.user) {
        return next(new NotFoundError("User doesnt exists"));
    }

    try {
        await passwordRecoveryService.generateAndSendResetCode(request.user);

        response.status(201).json({
            success: true,
            message: `Genereted code has been send to an email address - ${request.user.email}`,
        });
    } catch (error) {
        console.error(new Error("Error occures ", { cause: error.message }));

        if (error instanceof ConflictError) {
            return next(error);
        }

        next(new BadRequest());
    }
}

export async function passwordRecoveryAuth(
    request: Request<{}, {}, PasswordRecoveryAuthBodyPayload>,
    response: Response,
    next
) {
    if (!request.user) {
        return next(new NotFoundError("User doesnt exists"));
    }

    try {
        await passwordRecoveryService.authorizeResetPassword(
            request.user,
            request.body
        );

        response.status(201).json({
            success: true,
            message: "Access open",
        });
    } catch (error) {
        console.error(new Error("Error occures ", { cause: error.message }));

        next(new BadRequest());
    }
}
