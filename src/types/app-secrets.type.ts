import { SSM_PATHS } from "../constans/ssm-paths.js";

export type AppSecrets = {
    [K in keyof typeof SSM_PATHS]: string;
};

export type SsmParameterPath = (typeof SSM_PATHS)[keyof typeof SSM_PATHS];
