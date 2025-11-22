import express from "express";

import {
    resetPasswordAuthValidator,
    resetPasswordLinkValidator,
    setNewPasswordvalidator,
    signInValidator,
    signUpValidator,
} from "./auth.validators.js";
import { validateRequest } from "../utils/validator.js";
import {
    resetPasswordAuth,
    resetPasswordLink,
    setNewPassword,
    signIn,
    signUp,
} from "./auth.controllers.js";
import errorHandler from "../middlewares/errorHandler.js";
import { accountExists } from "../middlewares/accountExists.js";

const authRoutes = express.Router();

authRoutes.post("/sign-in", signInValidator, validateRequest.bind(this), [
    accountExists,
    signIn,
    errorHandler,
]);

authRoutes.post("/sign-up", signUpValidator, validateRequest.bind(this), [
    accountExists,
    signUp,
    errorHandler,
]);

authRoutes.post(
    "/reset-password-link",
    resetPasswordLinkValidator,
    validateRequest.bind(this),
    [accountExists, resetPasswordLink, errorHandler]
);

authRoutes.post(
    "/reset-password-auth",
    resetPasswordAuthValidator,
    validateRequest.bind(this),
    [accountExists, resetPasswordAuth, errorHandler]
);

authRoutes.post(
    "/set-new-password",
    setNewPasswordvalidator,
    validateRequest.bind(this),
    [accountExists, setNewPassword, errorHandler]
);

export default authRoutes;
