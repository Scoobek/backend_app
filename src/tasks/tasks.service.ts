import { ObjectId } from "mongodb";
import { taskRepository } from "./tasks.repository.js";
import {
    AddNewTaskRequestBody,
    EditTaskRequestBody,
    ITaskDocument,
    PatchTask,
} from "./tasks.types.js";

class TasksService {
    async getAllTasks(userId: string): Promise<[] | ITaskDocument[]> {
        const userTasksResult = await taskRepository.getAllTasks(userId);

        if (userTasksResult) {
            return userTasksResult.tasks;
        }

        return [];
    }

    async addNewTask(userId: string, bodyPayload: AddNewTaskRequestBody) {
        const { description, priority, status, title } = bodyPayload;

        const taskDocument: ITaskDocument = {
            createdAt: new Date().getTime(),
            description,
            priority,
            status,
            title,
            _id: new ObjectId(),
        };

        await taskRepository.insertNewTask(userId, taskDocument);
    }

    async editTask(userId: string, bodyPayload: EditTaskRequestBody) {
        const setFields = {} as PatchTask;
        const taskId = bodyPayload.taskId;

        for (const key in bodyPayload) {
            if (key !== "taskId")
                setFields[`tasks.$.${key}`] = bodyPayload[key];
        }

        setFields[`tasks.$.updatedAt`] = Number(new Date());

        await taskRepository.updateTask(userId, taskId, setFields);
    }

    async deleteTask(userId: string, taskId: string) {
        await taskRepository.deleteTask(userId, taskId);
    }
}

export const tasksService = new TasksService();
