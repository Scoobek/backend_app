import {
    SSMClient,
    GetParameterCommand,
    GetParameterCommandInput,
} from "@aws-sdk/client-ssm";

const ssmClient = new SSMClient({ region: process.env.AWS_REGION });

async function getSmmParameter(name: string, decrypt = false): Promise<string> {
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

export async function loadSecrets() {
    const [NODE_ENV, PORT] = await Promise.all([
        getSmmParameter("NODE_ENV"),
        getSmmParameter("PORT"),
    ]);

    return { NODE_ENV, PORT };
}
