import express from "express";
import { IAuthUser } from "../user/types.ts";

declare module "express" {
    export interface Request {
        user: IAuthUser | null;
    }
}
