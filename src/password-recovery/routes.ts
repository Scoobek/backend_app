import express from "express";

import errorHandler from "../middlewares/errorHandler.js";
import { accountExists } from "../middlewares/accountExists.js";

import { validateRequest } from "../utils/validator.js";

import { setNewPassword } from "../user/controller.js";

import { passwordRecoveryAuth, passwordRecoveryLink } from "./controller.js";

import {
    passwordRecoveryAuthValidator,
    passwordRecoveryLinkValidator,
    passwordRecoverySetNewValidator,
} from "./validators.js";

export const passwordRecoveryRoutes = express.Router();

passwordRecoveryRoutes.post(
    "/password-recovery-link",
    passwordRecoveryLinkValidator,
    validateRequest.bind(this),
    [accountExists, passwordRecoveryLink, errorHandler]
);

passwordRecoveryRoutes.post(
    "/password-recovery-auth",
    passwordRecoveryAuthValidator,
    validateRequest.bind(this),
    [accountExists, passwordRecoveryAuth, errorHandler]
);

passwordRecoveryRoutes.post(
    "/password-recovery-set-new",
    passwordRecoverySetNewValidator,
    validateRequest.bind(this),
    [accountExists, setNewPassword, errorHandler]
);
