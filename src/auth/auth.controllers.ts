import { NextFunction, type Request, type Response } from "express";
import jwt from "jsonwebtoken";
import crypto from "crypto";

import {
    SignUpRequestBody,
    SignInRequestBody,
    ResetPasswordRequestBody,
    ResetPasswordAuthBody,
    setNewPasswordBody,
} from "./auth.types.js";

import { comparePasswords, hashPassword } from "../utils/password.js";
import {
    BadRequest,
    ConflictError,
    NotFoundError,
    UnauthorizedError,
} from "../utils/apiError.js";

import { COLLECTION_NAME, getDb } from "../config/db.config.js";
import { sendMail } from "../config/node-mailer.config.js";
import authConfig from "../config/auth.config.js";

import { ResetPasswordData, User } from "../user/user.type.js";

export async function signIn(
    request: Request<{}, {}, SignInRequestBody>,
    response: Response,
    next
) {
    if (!request.user) {
        return next(new NotFoundError("Wrong email or password"));
    }

    try {
        const { password, _id, email } = request.user;

        const passwordMatched = await comparePasswords(
            password,
            request.body.password
        );

        setTimeout(() => {
            throw new Error("Test Sync Error!");
        }, 1000);

        if (passwordMatched) {
            const customClaims = {
                email,
                iat: new Date().getTime(),
                id: _id,
            };

            //generate JWT token
            const token = jwt.sign(customClaims, authConfig.secret, {
                expiresIn: 60,
            });

            response.status(201).json({
                success: true,
                message: "User logged in",
                data: {
                    accessToken: token,
                },
            });
        } else {
            next(
                new BadRequest(
                    "The new password and the confirmation password do not match."
                )
            );
        }
    } catch (error) {
        console.error(new Error("Error occures ", { cause: error.message }));
        next(new BadRequest());
    }
}

export async function signUp(
    request: Request<{}, {}, SignUpRequestBody>,
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
    const { email, password, userName } = request.body;

    try {
        const hashedPassword = hashPassword(password);

        await getDb().collection<User>(COLLECTION_NAME).insertOne({
            email,
            userName,
            password: hashedPassword,
        });
    } catch (error) {
        console.error("Error adding data to db ", { cause: error.message });
        next(new BadRequest());
    }

    response.status(201).json({
        success: true,
        message: "A new user has been created",
        data: {
            email,
            userName,
        },
    });
}

export async function resetPasswordLink(
    request: Request<{}, {}, ResetPasswordRequestBody>,
    response: Response,
    next
) {
    if (!request.user) {
        return next(new NotFoundError("User doesnt exists"));
    }
    const { email, _id } = request.user;

    try {
        const lastResetPasswordElement: ResetPasswordData | undefined =
            request.user.resetPasswordData?.slice(-1)[0] ?? null;

        const timeNow = new Date();
        const futureTime = new Date(timeNow);

        if (lastResetPasswordElement) {
            if (lastResetPasswordElement.timeStamp > timeNow.getTime()) {
                // code still exists
                return next(new ConflictError());
            }
        }

        const generatedCode = crypto.randomInt(100000, 1000000);
        const timeNowPlus2Minutes = futureTime.setMinutes(
            futureTime.getMinutes() + 2
        );

        await getDb()
            .collection<User>(COLLECTION_NAME)
            .updateOne(
                {
                    _id,
                },
                {
                    $push: {
                        resetPasswordData: {
                            timeStamp: timeNowPlus2Minutes,
                            generatedCode,
                        },
                    },
                }
            );

        const customClaims = {
            email: request.user.email,
            iat: new Date().getTime(),
            id: _id,
        };
        //generate JWT token
        const accessToken = jwt.sign(customClaims, authConfig.secret, {
            expiresIn: 60,
        });

        await sendMail(email, generatedCode);

        response.status(201).json({
            success: true,
            message: `Genereted code has been send to an email address - ${email}`,
            data: {
                accessToken,
            },
        });
    } catch (error) {
        console.error(new Error("Error occures ", { cause: error.message }));
        next(new BadRequest());
    }
}

export async function resetPasswordAuth(
    request: Request<{}, {}, ResetPasswordAuthBody>,
    response: Response,
    next
) {
    if (!request.user) {
        return next(new NotFoundError("User doesnt exists"));
    }

    try {
        const { generatedCode } = request.body;
        const lastResetPasswordElement: ResetPasswordData | undefined =
            request.user.resetPasswordData?.slice(-1)[0] ?? null;

        const timeNow = new Date();

        if (lastResetPasswordElement) {
            if (lastResetPasswordElement.timeStamp < timeNow.getTime()) {
                return next(
                    new UnauthorizedError(
                        "The provided code has expired. Please request a new one."
                    )
                );
            }
        }

        if (lastResetPasswordElement.generatedCode !== Number(generatedCode)) {
            return next(
                new UnauthorizedError("Wrong authorization code, try again")
            );
        }

        const customClaims = {
            email: request.user.email,
            iat: new Date().getTime(),
            id: request.user._id,
        };

        const accessToken = jwt.sign(customClaims, authConfig.secret, {
            expiresIn: 60,
        });

        response.status(201).json({
            success: true,
            message: "Access open",
            data: {
                accessToken,
            },
        });
    } catch (error) {
        console.error(new Error("Error occures ", { cause: error.message }));
        next(new BadRequest());
    }
}

export async function setNewPassword(
    request: Request<{}, {}, setNewPasswordBody>,
    response: Response,
    next
) {
    if (!request.user) {
        return next(new NotFoundError("User doesnt exists"));
    }

    const { newPassword, confirmedNewPassword } = request.body;
    const { _id, password } = request.user;

    const passwordMatched = await comparePasswords(password, newPassword);

    if (passwordMatched) {
        return next(
            new BadRequest(
                "The new password cannot be the same as your current password."
            )
        );
    }

    if (newPassword !== confirmedNewPassword) {
        return next(new BadRequest("Passwords aren't same"));
    }

    const newHashedPassword = hashPassword(newPassword);

    try {
        await getDb()
            .collection<User>(COLLECTION_NAME)
            .updateOne(
                {
                    _id,
                },
                {
                    $set: { password: newHashedPassword },
                }
            );

        response.status(201).json({
            success: true,
            message: "Password has been changed succesful",
        });
    } catch (error) {
        console.error(new Error("Error occures ", { cause: error.message }));
        next(new BadRequest());
    }
}
