import { Document, ObjectId } from "mongodb";

type TaskPriorytyType = "1" | "2" | "3";
type TaskStatusType = "done" | "inProgress" | "ready";

export interface AddNewTaskRequestBody {
    description: string;
    priority: "1" | "2" | "3";
    status: "ready";
    title: string;
}

export interface EditTaskRequestBody extends PatchTask {
    taskId: string;
}

export interface DeleteTaskRequestBody {
    taskId: string;
}

// ---------------------------------------------

export type PatchTask = Partial<Omit<ITask, "createdAt">> & {
    taskId: string;
    updatedAt: number;
};

export interface ITask {
    createdAt: number;
    description: string;
    priority: TaskPriorytyType;
    status: TaskStatusType;
    title: string;
}

export interface ITaskDocument extends Document, ITask {
    _id: ObjectId;
}

export interface IUserTasks {
    userId: string;
    tasks: ITaskDocument[];
}

export interface IUserTasksDocument extends Document, IUserTasks {
    _id: ObjectId;
}
