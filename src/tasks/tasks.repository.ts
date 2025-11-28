import { ObjectId } from "mongodb";

import { COLLECTION_TASKS, getDb } from "../config/db.config.js";

import { ITaskDocument, IUserTasks, PatchTask } from "./tasks.types.js";
import { IAuthUser } from "../user/types.js";

class TaskRepository {
    private async getCollection() {
        const db = await getDb();

        return db.collection<IUserTasks>(COLLECTION_TASKS);
    }

    async getAllTasks(userId: IAuthUser["userId"]) {
        const collection = await this.getCollection();

        const filter = {
            userId,
        };

        return collection.findOne(filter, {
            projection: {
                tasks: 1,
                _id: 0,
            },
        });
    }

    async insertNewTask(userId: IAuthUser["userId"], task: ITaskDocument) {
        const collection = await this.getCollection();

        const query = {
            userId,
        };

        const updateOperation = {
            $push: {
                tasks: task,
            },
        };

        return collection.updateOne(query, updateOperation, {
            upsert: true,
        });
    }

    async updateTask(
        userId: IAuthUser["userId"],
        taskId: string,
        fields: PatchTask
    ) {
        const collection = await this.getCollection();

        const query = {
            userId,
            "tasks._id": new ObjectId(taskId),
        };

        return collection.updateOne(query, { $set: fields });
    }

    async deleteTask(userId: IAuthUser["userId"], taskId: string) {
        const collection = await this.getCollection();

        const query = {
            userId,
        };

        const updateOperation = {
            $pull: {
                tasks: {
                    _id: new ObjectId(taskId),
                },
            },
        };

        return collection.updateOne(query, updateOperation);
    }
}

export const taskRepository = new TaskRepository();
