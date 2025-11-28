import express from "express";
import verifyToken from "../middlewares/auth-jwt.js";
import {
    addNewTask,
    deleteTask,
    editTask,
    getAllTasks,
} from "./tasks.controller.js";
import errorHandler from "../middlewares/errorHandler.js";

export const tasksRouter = express.Router();

tasksRouter.get("/get-all-tasks", verifyToken, [getAllTasks, errorHandler]);

tasksRouter.post("/add-new-task", verifyToken, [addNewTask, errorHandler]);

tasksRouter.patch("/edit-task", verifyToken, [editTask, errorHandler]);

tasksRouter.delete("/delete-task", verifyToken, [deleteTask, errorHandler]);
