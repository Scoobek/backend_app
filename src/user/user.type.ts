export interface User {
    _id?: string;
    email: string;
    password: string;
    userName: string;
    resetPasswordData?: Array<ResetPasswordData> | undefined;
}

export interface FindLostEmailRequestBody {
    email: string;
}

export interface ResetPasswordData {
    timeStamp: number;
    generatedCode: number;
}
