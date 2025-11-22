export type UserRole = "admin" | "user";

export interface SignInRequestBody {
    email: string;
    password: string;
}

export interface SignUpRequestBody {
    email: string;
    password: string;
    userName: string;
    userRole: UserRole;
}

export interface ResetPasswordRequestBody {
    email: string;
}

export interface ResetPasswordAuthBody {
    generatedCode: number;
    email: string;
}

export interface setNewPasswordBody {
    confirmedNewPassword: string;
    email: string;
    newPassword: string;
}

export type UserClaims = {
    email: string;
    role: UserRole;
};
