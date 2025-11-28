export interface SignUpBodyPayload {
    name: string;
    email: string;
    surName: string;
    role: "admin" | "user";

    password: string;
    confirmPassword: string;
}

export interface SignInBodyPayload {
    email: string;
    password: string;
}

export interface SetNewPasswordBodyPayload {
    oldPassword: string;
    newPassword: string;
    confirmNewPassword: string;
}

export interface PasswordRecoveryLinkBodyPayload {
    email: string;
}

export interface PasswordRecoveryAuthBodyPayload {
    generatedCode: number;
}
