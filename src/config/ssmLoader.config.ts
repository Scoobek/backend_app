import {
    SSMClient,
    GetParameterCommand,
    GetParameterCommandInput,
} from "@aws-sdk/client-ssm";

import { SSM_PATHS } from "../constans/ssm-paths.js";
import { AppSecrets, SsmParameterPath } from "../types/app-secrets.type.js";

const ssmClient = new SSMClient({ region: process.env.AWS_REGION });

async function getSmmParameter(
    name: SsmParameterPath,
    decrypt = false
): Promise<string> {
    const params: GetParameterCommandInput = {
        Name: name,
        WithDecryption: decrypt,
    };

    const command = new GetParameterCommand(params);

    try {
        const data = await ssmClient.send(command);
        if (!data.Parameter || !data.Parameter.Value) {
            throw new Error(`SSM PARAMETER NOT FOUND, ${name}`);
        }

        return data.Parameter.Value;
    } catch (error) {
        throw error;
    }
}

export async function loadSecrets(): Promise<AppSecrets> {
    const paths = Object.values(SSM_PATHS);

    const promises = paths.map((path) => getSmmParameter(path));

    const values = await Promise.all(promises);

    const [
        AWS_REGION,
        DB_NAME,
        DB_URL,
        JWT_SECRET,
        NODE_ENV,
        PORT,
        SMTP_HOST,
        SMTP_PASSWORD,
        SMTP_PORT,
        SMTP_USER,
    ] = values;

    return {
        AWS_REGION,
        DB_NAME,
        DB_URL,
        JWT_SECRET,
        NODE_ENV,
        PORT,
        SMTP_HOST,
        SMTP_PASSWORD,
        SMTP_PORT,
        SMTP_USER,
    };
}
