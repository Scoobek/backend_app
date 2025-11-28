import { Document, type ObjectId } from "mongodb";

export interface IPasswordRecoveryAttempt {
    generatedCode: number;
    timeStamp: number;
}

export interface IPasswordRecovery {
    userId: ObjectId;
    passwordRecoveryAttempts: IPasswordRecoveryAttempt[];
}

export interface IPasswordRecoveryDocument extends Document, IPasswordRecovery {
    _id: ObjectId;
}
