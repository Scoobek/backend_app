import jwt from "jsonwebtoken";

import { IAuthUser } from "../user/types.js";

const createAccessToken = (userId: IAuthUser["userId"], email: string) => {
    const customClaims = {
        email,
        iat: new Date().getTime(),
        id: userId,
    };

    return jwt.sign(customClaims, process.env.JWT_SECRET, {
        // 10 minutes
        expiresIn: 10 * 60 * 1000,
    });
};

export default createAccessToken;
