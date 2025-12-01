import { type Request } from "express";
import { ObjectId, WithoutId } from "mongodb";

import {
    SetNewPasswordBodyPayload,
    SignInBodyPayload,
    SignUpBodyPayload,
} from "../types/request-body.type.js";

import { comparePasswords, hashPassword } from "../utils/password.js";
import { UnauthorizedError } from "../errors/apiError.js";
import createAccessToken from "../utils/jwt.js";

import { userRepository } from "./repository.js";
import { IAuthUser, IUser } from "./types.js";

class UserService {
    async setNewPassword(request: Request<{}, {}, SetNewPasswordBodyPayload>) {
        const userDocumentId = new ObjectId(request.user.userId);

        const listOfHistoryResult =
            await userRepository.getListOfHitoryPasswords(userDocumentId);

        const flatHistoryPasswordHashes = listOfHistoryResult[0].hashes;

        if (flatHistoryPasswordHashes.length > 0) {
            for (const hash of flatHistoryPasswordHashes) {
                const isMatched = await comparePasswords(
                    request.body.newPassword,
                    hash
                );

                if (isMatched)
                    throw Error("Password has been used some time ago");
            }
        }

        const newHashedPassword = hashPassword(request.body.newPassword);

        const userPasswordUpdated = await userRepository.updateUserPassword(
            userDocumentId,
            newHashedPassword
        );

        if (!userPasswordUpdated.acknowledged)
            throw Error("Updating new password failed");

        const setPasswordHistoryResult =
            await userRepository.setPasswordHistory(
                userDocumentId,
                newHashedPassword
            );

        if (!setPasswordHistoryResult.acknowledged)
            throw Error("Setting history result failed");

        const [{ passwordHistory }] =
            await userRepository.getUserHistoryPasswords(userDocumentId, true);

        const oldestHistoryPassword = passwordHistory[0];

        const updatePasswordHistoryResult =
            await userRepository.updatePasswordHistory(
                userDocumentId,
                oldestHistoryPassword.passwordHash,
                new Date().getTime()
            );

        if (!updatePasswordHistoryResult.acknowledged)
            throw Error("Update history failed");
    }

    async createNewUser(bodyPayload: SignUpBodyPayload) {
        const { email, name, password, role, surName } = bodyPayload;

        const hashedPassword = hashPassword(password);

        const newUserData: IUser = {
            email,
            name,
            passwordHash: hashedPassword,
            passwordHistory: [],
            role,
            surName,
        };

        const createdUser = await userRepository.createUser(newUserData);

        if (!createdUser.acknowledged) throw Error("Insert new data failed");

        const setPasswordHistoryResut = await userRepository.setPasswordHistory(
            createdUser.insertedId,
            hashedPassword
        );

        if (!setPasswordHistoryResut.acknowledged)
            throw Error("Insert new data failed");
    }

    async signInUser(user: IAuthUser, bodyPayload: SignInBodyPayload) {
        const { userId, email } = user;
        const { password } = bodyPayload;

        const userDocumentId = new ObjectId(userId);

        const currentUser: WithoutId<{ passwordHash: string }> =
            await userRepository.getUserPasswordHash(userDocumentId);

        if (!currentUser.passwordHash) throw Error();

        const passwordMatched = await comparePasswords(
            password,
            currentUser.passwordHash
        );

        if (passwordMatched) {
            return createAccessToken(userId, email);
        }
        throw new UnauthorizedError("Password didin't match");
    }
}

export const userService = new UserService();
