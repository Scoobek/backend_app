import { type Request, type Response } from "express";
import { FindLostEmailRequestBody, User } from "./user.type.js";
import { hashPassword } from "../utils/password.js";

export function findLostUser(
    request: Request<{}, {}, FindLostEmailRequestBody>,
    response: Response
) {
    const { email } = request.body;

    //check if user exists
    // no, send error message
    //send information about mail that was send with the numbers to validate

    response.status(201).json({
        success: true,
        message: "A user has been found",
        data: {
            email,
        },
    });
}

export function addNewUser(request: Request<{}, {}>, response: Response) {
    const { userName, email, password } = request.body;

    //check if user exists already by email ofc
    //yes send error
    //crypt password
    //save on base

    const hashedPassword = hashPassword(password);

    response.status(201).json({
        success: true,
        message: "A new user has been created",
        data: {
            email,
            hashedPassword,
            userName,
        },
    });
}

export function getAllUsers(request: Request, response: Response) {
    //make a
    const users = [
        { id: 0, name: "Alice" },
        { id: 1, name: "Bob" },
    ];
    response.json(users);
}
