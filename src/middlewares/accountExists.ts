import { type Request, type Response } from "express";

import { COLLECTION_USERS, getDb } from "../config/db.config.js";
import { IUserDocument } from "../user/types.js";

export async function accountExists(
    request: Request,
    response: Response,
    next
) {
    try {
        const { email } = request.body;

        const user = await getDb()
            .collection<IUserDocument>(COLLECTION_USERS)
            .findOne(
                {
                    email,
                },
                {
                    projection: {
                        _id: 1,
                        email: 1,
                        role: 1,
                    },
                }
            );

        request.user = user
            ? {
                  email: user.email,
                  userId: user._id.toString(),
              }
            : null;

        next();
    } catch (error) {
        console.error(new Error("Error occures ", { cause: error.message }));
    }
}
