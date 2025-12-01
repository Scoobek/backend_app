import "./config/envLoader.config.js";

import express, { type Request, type Response } from "express";
import path from "path";

import { connectDB } from "./config/db.config.js";

import { tasksRouter } from "./tasks/tasks.routes.js";
import verifyToken from "./middlewares/auth-jwt.js";
import userRoutes from "./user/routes.js";

import { passwordRecoveryRoutes } from "./password-recovery/routes.js";
import { fileURLToPath } from "url";
import { loadSecrets } from "./config/ssmLoader.config.js";
import errororHandler from "./middlewares/errorHandler.js";
import { NotFoundError } from "./errors/apiError.js";

async function bootstrap() {
    try {
        // setups
        const __filename = fileURLToPath(import.meta.url);
        const __dirname = path.dirname(__filename);
        const publicPath = path.join(__dirname, "../../client/public");

        //production on
        if (process.env.NODE_ENV === "production") {
            //secrets
            const secrets = await loadSecrets();

            console.log(secrets);

            process.env.NODE_ENV = secrets.NODE_ENV;
            process.env.PORT = secrets.PORT;
        }

        const PORT = process.env.PORT || 3000;

        //database connection
        await connectDB();

        //express routes
        const app = express();

        app.use(express.json());
        app.use(express.static(publicPath));

        // routes
        app.use("/api", userRoutes);
        app.use("/api", tasksRouter);
        app.use("/api", passwordRecoveryRoutes);

        app.get("/", verifyToken, (req: Request, res: Response) => {
            res.sendFile(path.join(publicPath, "index.html"));
        });

        app.use((req, res, next) => {
            const error = new NotFoundError("Sorry, can't find that route!");

            next(error);
        });

        app.use(errororHandler);

        app.listen(PORT, (error) => {
            if (error) {
                console.error("error occures");
                throw error;
            }
            console.log("server working at", PORT);
        });
    } catch (error) {
        console.error("CRITICAL: Failed to bootstrap application.", error);
        process.exit(1);
    }
}

bootstrap();

process.on("uncaughtException", (err, origin) => {
    console.error(`Uncaught Exception at ${origin}:`, err);
});
