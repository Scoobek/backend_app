import { UpdateFilter } from "mongodb";
import { COLLECTION_USERS, getDb } from "../config/db.config.js";
import { IUser, IUserDocument } from "./types.js";

class UserRepository {
    private async getCollection() {
        const db = getDb();
        return db.collection<IUserDocument>(COLLECTION_USERS);
    }

    async createUser(newUserData: IUser) {
        return await getDb()
            .collection<IUser>(COLLECTION_USERS)
            .insertOne({ ...newUserData });
    }

    async updateUserPassword(
        userId: IUserDocument["_id"],
        newHashedPassword: string
    ) {
        const collection = await this.getCollection();

        const query = {
            _id: userId,
        };

        const updateOperation = {
            $set: {
                passwordHash: newHashedPassword,
            },
        };

        return collection.updateOne(query, updateOperation);
    }

    async getUserPasswordHash(userId: IUserDocument["_id"]) {
        const collection = await this.getCollection();

        const query = {
            _id: userId,
        };

        return collection.findOne(query, {
            projection: {
                passwordHash: 1,
                _id: 0,
            },
        });
    }

    async getListOfHitoryPasswords(userId: IUserDocument["_id"]) {
        const collection = await this.getCollection();

        const pipeline = [
            {
                $match: { _id: userId },
            },
            {
                $unwind: "$passwordHistory",
            },
            {
                $project: {
                    _id: 0,
                    hash: "$passwordHistory.passwordHash",
                },
            },
            {
                $group: {
                    _id: null,
                    hashes: { $push: "$hash" },
                },
            },
        ];

        return collection.aggregate(pipeline).toArray();
    }

    async setPasswordHistory(
        userId: IUserDocument["_id"],
        newHashedPassword: string
    ) {
        const collection = await this.getCollection();

        const filter = {
            _id: userId,
        };

        const newHistoryPassword: IUserDocument["passwordHistory"] = [
            {
                createdAt: new Date().getTime(),
                passwordHash: newHashedPassword,
                retiredAt: null,
            },
        ];

        const updateOperation = {
            $push: {
                passwordHistory: {
                    $each: newHistoryPassword,
                },
            },
        } as any as UpdateFilter<IUserDocument>;

        return await collection.updateOne(filter, updateOperation);
    }

    async updatePasswordHistory(
        userId: IUserDocument["_id"],
        targetHash: string,
        retiredAtValue: number
    ) {
        const collection = await this.getCollection();

        const filter = {
            _id: userId,
            "passwordHistory.passwordHash": targetHash,
        };

        const updateOperation = {
            $set: {
                "passwordHistory.$[historyEntry].retiredAt": retiredAtValue,
            },
        };

        return collection.updateOne(filter, updateOperation, {
            arrayFilters: [{ "historyEntry.passwordHash": targetHash }],
        });
    }

    async getUserHistoryPasswords(
        userId: IUserDocument["_id"],
        desc: boolean = false
    ) {
        const collection = await this.getCollection();

        const query = {
            _id: userId,
        };

        const result = collection.find(query, {
            projection: { passwordHistory: 1 },
        });

        if (result && desc) {
            result.sort({ createdAt: 1 });
        }

        return result.toArray();
    }
}

export const userRepository = new UserRepository();
