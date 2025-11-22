import express from "express";
import { User } from "../user/user.type.ts";

declare module "express" {
    export interface Request {
        user?: User | null;
    }
}
