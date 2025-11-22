import { body } from "express-validator";

const addNewUserValidator = [
    body("userName")
        .isString()
        .withMessage("userName must be string")
        .trim()
        .isLength({ min: 3, max: 15 })
        .withMessage("userName must be between 3 and 15 chars"),
    body("email")
        .isEmail()
        .withMessage("Please enter a valid email address")
        .normalizeEmail(),
    body("password")
        .isLength({ min: 8 })
        .withMessage("Password must be atleast 8 chars"),
];

const findLostUserValidator = [
    body("email")
        .isEmail()
        .notEmpty()
        .withMessage("Please enter a valid email address")
        .normalizeEmail(),
];

export { addNewUserValidator, findLostUserValidator };
