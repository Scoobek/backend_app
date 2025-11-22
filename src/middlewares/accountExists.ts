import { type Request } from "express";
import { COLLECTION_NAME, getDb } from "../config/db.config.js";
import { User } from "../user/user.type.js";

export async function accountExists(
    request: Request,
    response: Response,
    next
) {
    try {
        const { email } = request.body;

        const user = await getDb().collection<User>(COLLECTION_NAME).findOne({
            email,
        });

        request.user = user;
        next();
    } catch (error) {
        console.error(new Error("Error occures ", { cause: error.message }));
    }
}
