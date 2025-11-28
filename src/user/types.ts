import { ObjectId, Document } from "mongodb";

export interface IUser {
    name: string;
    email: string;
    surName: string;
    role: "admin" | "user";

    passwordHash: string;
    passwordHistory: IUserPasswordHistory[];
}

type IUserPasswordHistory = {
    passwordHash: string;
    retiredAt: number | null;
    createdAt: number;
};

export interface IAuthUser {
    userId: string;
    email: string;
}

export interface IUserDocument extends IUser, Document {
    _id: ObjectId;
}
