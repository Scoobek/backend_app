import { body } from "express-validator";

const signUpValidator = [
    body("userName")
        .isString()
        .withMessage("userName must be string")
        .trim()
        .isLength({ min: 3, max: 15 })
        .withMessage("userName must be between 3 and 15 chars"),
    body("email")
        .isEmail()
        .notEmpty()
        .withMessage("Please enter a valid email address")
        .normalizeEmail(),
    body("password").notEmpty(),
    body("userType"),
];

const signInValidator = [
    body("email")
        .isEmail()
        .notEmpty()
        .withMessage("Please enter a valid email address")
        .normalizeEmail(),
    body("password").notEmpty(),
];

const resetPasswordLinkValidator = [
    body("email")
        .isEmail()
        .notEmpty()
        .withMessage("Please enter a valid email address")
        .normalizeEmail(),
];

const resetPasswordAuthValidator = [
    body("generatedCode")
        .notEmpty()
        .isLength({ min: 6, max: 6 })
        .withMessage("Verification code must be exactly 6 digits long."),
];

const setNewPasswordvalidator = [
    body("newPassword").notEmpty(),
    body("confirmedNewPassword").notEmpty(),
];

export {
    resetPasswordAuthValidator,
    resetPasswordLinkValidator,
    setNewPasswordvalidator,
    signInValidator,
    signUpValidator,
};
