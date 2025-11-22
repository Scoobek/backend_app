import express from "express";
import {
    addNewUserValidator,
    findLostUserValidator,
} from "./user.validators.js";
import { validateRequest } from "../utils/validator.js";
import { addNewUser, findLostUser, getAllUsers } from "./user.controller.js";

const userRoutes = express.Router();

// GET
userRoutes.get("/get-all-users", getAllUsers);

//POST
userRoutes.post(
    "/add-new-user",
    addNewUserValidator,
    validateRequest.bind(this),
    addNewUser
);

userRoutes.post(
    "/find-lost-user",
    findLostUserValidator,
    validateRequest.bind(this),
    findLostUser
);

export default userRoutes;
