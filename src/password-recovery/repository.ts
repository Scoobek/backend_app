import { COLLECTIONS } from "../constans/db.js";
import { getDb } from "../config/db.config.js";
import { IUserDocument } from "../user/types.js";

import {
    IPasswordRecoveryAttempt,
    IPasswordRecoveryDocument,
} from "./types.js";

class PasswordRecoveryRepository {
    private async getCollection() {
        const db = getDb();

        return db.collection<IPasswordRecoveryDocument>(
            COLLECTIONS.PASSWORD_RECORVERY
        );
    }

    async findLastAttempt(userId: IUserDocument["_id"]) {
        const collection = await this.getCollection();

        const query = { userId };

        const userAttemptsResult = collection.findOne(query, {
            projection: {
                passwordRecoveryAttempts: { $slice: -1 },
                _id: 0,
                userId: 0,
            },
        });

        return userAttemptsResult;
    }

    async createAttempt(
        userId: IUserDocument["_id"],
        attemptData: IPasswordRecoveryAttempt
    ) {
        const collection = await this.getCollection();

        const query = { userId };

        const updateOperation = {
            $addToSet: {
                passwordRecoveryAttempts: attemptData,
            },
            $set: {
                userId,
            },
        };

        return collection.updateOne(query, updateOperation, {
            upsert: true,
        });
    }
}

export const passwordRecoveryRepository = new PasswordRecoveryRepository();
