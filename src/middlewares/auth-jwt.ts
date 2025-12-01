//authorizatrion -> refreshing tokens
import { ObjectId } from "mongodb";
import { type Response, type Request, raw } from "express";
import jwt from "jsonwebtoken";

import { UserJwtPayload } from "../types/jwt.types.js";

const verifyToken = async (request: Request, response: Response, next) => {
    const rawHeader =
        request.headers["x-access-token"] ||
        (request.headers["authorization"] as string);

    if (!rawHeader) {
        return response.status(403).json({
            status: false,
            message: "No token",
        });
    }

    let tokenString: string = "";

    Array.isArray(rawHeader)
        ? (tokenString = rawHeader[0])
        : (tokenString = rawHeader);

    const token = tokenString.startsWith("Bearer ")
        ? tokenString.split(" ")[1]
        : tokenString;

    try {
        const decodedToken = jwt.verify(
            token,
            process.env.JWT_SECRET
        ) as UserJwtPayload;

        const dateNow = new Date();
        const tokenExiredDate = new Date(decodedToken.exp);

        if (dateNow > tokenExiredDate) throw Error("Token has expired");

        const user = {
            userId: decodedToken.id,
            email: decodedToken.email,
        };

        request.user = user;

        next();
    } catch (error) {
        console.error(new Error("Error occures ", { cause: error.message }));
        response.status(401).json({
            message: "Unauthorized!",
        });
    }
};

export default verifyToken;
