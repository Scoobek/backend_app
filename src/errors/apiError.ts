export class ApiError extends Error {
    public status: number;
    constructor(message, status) {
        super(message);

        this.status = status;

        this.name = this.constructor.name;
    }
}

export class BadRequest extends ApiError {
    constructor(message = "Server bad request") {
        super(message, 400);
    }
}

export class UnauthorizedError extends ApiError {
    constructor(message = "Authentication required") {
        super(message, 401);
    }
}

export class NotFoundError extends ApiError {
    constructor(message = "Resource not found") {
        super(message, 404);
    }
}

export class ConflictError extends ApiError {
    constructor(
        message = "A valid password reset link has already been sent to this email address. Please check your inbox (and spam folder) for the active link. If you need a new code, wait for the current one to expire."
    ) {
        super(message, 409);
    }
}
