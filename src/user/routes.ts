import express from "express";

import errorHandler from "../middlewares/errorHandler.js";
import { accountExists } from "../middlewares/accountExists.js";

import { validateRequest } from "../utils/validator.js";

import { signIn, signUp } from "./controller.js";
import { signInValidator, signUpValidator } from "./validators.js";

const userRoutes = express.Router();

userRoutes.post("/sign-up", signUpValidator, validateRequest.bind(this), [
    accountExists,
    signUp,
    errorHandler,
]);

userRoutes.post("/sign-in", signInValidator, validateRequest.bind(this), [
    accountExists,
    signIn,
    errorHandler,
]);

export default userRoutes;
