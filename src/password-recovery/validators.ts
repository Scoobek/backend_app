import { body } from "express-validator";
import { SetNewPasswordBodyPayload } from "../types/request-body.type.js";

const passwordRecoveryLinkValidator = [
    body("email")
        .isEmail()
        .notEmpty()
        .withMessage("Please enter a valid email address")
        .normalizeEmail(),
];

const passwordRecoveryAuthValidator = [
    body("generatedCode")
        .notEmpty()
        .isLength({ min: 6, max: 6 })
        .withMessage("Verification code must be exactly 6 digits long."),
];

const passwordRecoverySetNewValidator = [
    body("newPassword")
        .notEmpty()
        .withMessage("Password is required")
        .isLength({ min: 8 })
        .withMessage("Password must be at least 8 characters long")
        .trim()
        .escape(),
    body("confirmedNewPassword")
        .trim()
        .escape()
        .custom((value: string, { req: { body } }) => {
            const typedBody = body as SetNewPasswordBodyPayload;

            if (value !== typedBody.newPassword) {
                throw new Error(
                    "Password confirmation does not match password"
                );
            }
            return true;
        }),
];

export {
    passwordRecoveryAuthValidator,
    passwordRecoveryLinkValidator,
    passwordRecoverySetNewValidator,
};
