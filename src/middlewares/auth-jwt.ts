//authorizatrion -> refreshing tokens
import jwt from "jsonwebtoken";
import { Response } from "express";
import authConfig from "../config/auth.config.js";

export async function verifyToken(request: Request, response: Response, next) {
    const token =
        request.headers["x-access-token"] || request.headers["authorization"];

    if (!token) {
        return response.status(403).json({
            status: false,
            message: "No token",
        });
    }

    try {
        const decoded = jwt.verify(
            token.replace("Bearer ", ""),
            authConfig.secret
        );

        //TODO

        // request.userId = decoded.id

        //check in DB

        next();
    } catch (e) {
        return response.status(401).json({
            message: "Unauthorized!",
        });
    }
}
