import crypto from "crypto";
import { ObjectId } from "mongodb";

import { sendMail } from "../config/node-mailer.config.js";

import { ConflictError, UnauthorizedError } from "../errors/apiError.js";

import { passwordRecoveryRepository } from "./repository.js";
import { IAuthUser } from "../user/types.js";
import { PasswordRecoveryAuthBodyPayload } from "../types/request-body.type.js";

class PasswordRecoveryService {
    async generateAndSendResetCode({ userId, email }: IAuthUser) {
        const userDocumentId = new ObjectId(userId);

        const lastAttemptTimeStampResult =
            await passwordRecoveryRepository.findLastAttempt(userDocumentId);

        const timeNow = new Date().getTime();

        if (
            lastAttemptTimeStampResult &&
            lastAttemptTimeStampResult.passwordRecoveryAttempts.length > 0
        ) {
            if (
                lastAttemptTimeStampResult.passwordRecoveryAttempts[0]
                    .timeStamp > timeNow
            ) {
                throw new ConflictError();
            }
        }

        const generatedCode = crypto.randomInt(100000, 1000000);
        const futureTime = new Date(timeNow);
        const timeNowPlus2Minutes = futureTime.setMinutes(
            futureTime.getMinutes() + 2
        );

        const attemptData = {
            generatedCode,
            timeStamp: timeNowPlus2Minutes,
        };

        const createAttemptResult =
            await passwordRecoveryRepository.createAttempt(
                userDocumentId,
                attemptData
            );

        console.log(createAttemptResult);

        await sendMail(email, generatedCode);
    }

    async authorizeResetPassword(
        { userId }: IAuthUser,
        { generatedCode }: PasswordRecoveryAuthBodyPayload
    ) {
        const userDocumentId = new ObjectId(userId);

        const lastAttemptResult =
            await passwordRecoveryRepository.findLastAttempt(userDocumentId);

        const timeNow = new Date().getTime();

        if (lastAttemptResult.passwordRecoveryAttempts[0].timeStamp < timeNow) {
            throw new UnauthorizedError(
                "The provided code has expired. Please request a new one."
            );
        }

        if (
            lastAttemptResult.passwordRecoveryAttempts[0].generatedCode !==
            Number(generatedCode)
        ) {
            throw new UnauthorizedError("Wrong authorization code, try again");
        }
    }
}

export const passwordRecoveryService = new PasswordRecoveryService();
