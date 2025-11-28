import jwt from "jsonwebtoken";
import { ObjectId } from "mongodb";

export interface UserJwtPayload extends jwt.JwtPayload {
    _id: ObjectId;
    email: string;
}
