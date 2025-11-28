import { body } from "express-validator";
import { SignUpBodyPayload } from "../types/request-body.type.js";

const signUpValidator = [
    body("name")
        .isString()
        .withMessage("name must be string")
        .trim()
        .isLength({ min: 3, max: 15 })
        .withMessage("name must be between 3 and 15 chars"),
    body("email")
        .isEmail()
        .notEmpty()
        .withMessage("Please enter a valid email address")
        .normalizeEmail(),
    body("surName")
        .isString()
        .withMessage("name must be string")
        .trim()
        .isLength({ min: 3, max: 15 })
        .withMessage("name must be between 3 and 15 chars"),
    body("role").notEmpty().isIn(["admin", "user"]),
    body("password")
        .notEmpty()
        .withMessage("Password is required") // Ensure password field is not empty
        .isLength({ min: 8 })
        .withMessage("Password must be at least 8 characters long")
        .trim()
        .escape(),
    body("confirmPassword")
        .trim()
        .escape()
        .custom(
            (
                value: SignUpBodyPayload["confirmPassword"],
                { req: { body } }
            ) => {
                const typedBody = body as SignUpBodyPayload;

                if (value !== typedBody.password) {
                    throw new Error(
                        "Password confirmation does not match password"
                    );
                }
                return true;
            }
        ),
];

const signInValidator = [
    body("email")
        .isEmail()
        .notEmpty()
        .withMessage("Please enter a valid email address")
        .normalizeEmail(),
    body("password").notEmpty(),
];

export { signInValidator, signUpValidator };
