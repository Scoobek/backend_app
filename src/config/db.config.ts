import { Db, MongoClient } from "mongodb";

const DB_URL = "mongodb://127.0.0.1:27017";

let dbInstance: Db | undefined;
let clientDbInstance: MongoClient | undefined;

export const DB_NAME = "proba";
export const COLLECTION_USERS = "users";
export const COLLECTION_TASKS = "tasks";
export const COLLECTION_PASSWORD_RECOVERY = "password";

export const connectDB = async () => {
    try {
        clientDbInstance = new MongoClient(DB_URL);

        await clientDbInstance.connect();

        dbInstance = clientDbInstance.db(DB_NAME);
    } catch (error) {
        console.error(
            new Error("Problem with db connection ", { cause: error.message })
        );
        process.exit(1);
    }
};

export const getDb = () => {
    if (!dbInstance) {
        throw Error("Database is not initialized");
    }

    return dbInstance;
};
