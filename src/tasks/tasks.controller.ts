import { NextFunction, Request, Response } from "express";

import {
    AddNewTaskRequestBody,
    DeleteTaskRequestBody,
    EditTaskRequestBody,
} from "./tasks.types.js";

import { BadRequest } from "../utils/apiError.js";
import { tasksService } from "./tasks.service.js";

export const getAllTasks = async (
    request: Request,
    response: Response,
    next: NextFunction
) => {
    const { userId } = request.user;

    try {
        const userTasks = await tasksService.getAllTasks(userId);

        response.status(200).json({
            success: true,
            data: {
                tasks: userTasks,
            },
        });
    } catch (error) {
        console.error(new Error("Error occures", { cause: error.message }));
        next(new BadRequest());
    }
};

export const addNewTask = async (
    request: Request<{}, {}, AddNewTaskRequestBody>,
    response: Response,
    next: NextFunction
) => {
    try {
        const { userId } = request.user;
        const bodyPayload = request.body;

        await tasksService.addNewTask(userId, bodyPayload);

        response.status(201).json({
            success: true,
            message: `Task has been added succesfuly`,
        });
    } catch (error) {
        console.error(new Error("Error occures", { cause: error.message }));
        next(new BadRequest());
    }
};

export const editTask = async (
    request: Request<{}, {}, EditTaskRequestBody>,
    response: Response,
    next: NextFunction
) => {
    try {
        const { userId } = request.user;
        const bodyPayload = request.body;

        await tasksService.editTask(userId, bodyPayload);

        response.status(201).json({
            success: true,
            message: `Task has been updated succesfuly`,
        });
    } catch (error) {
        console.error(new Error("Error occures", { cause: error.message }));
        next(new BadRequest());
    }
};

export const deleteTask = async (
    request: Request<{}, {}, DeleteTaskRequestBody>,
    response: Response,
    next: NextFunction
) => {
    try {
        const { taskId } = request.body;
        const { userId } = request.user;

        await tasksService.deleteTask(userId, taskId);

        response.status(201).json({
            success: true,
            message: `Task has been deleted succesfuly`,
        });
    } catch (error) {
        console.error(new Error("Error occures", { cause: error.message }));
        next(new BadRequest());
    }
};
