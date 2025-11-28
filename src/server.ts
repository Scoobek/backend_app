import express, { type Request, type Response } from "express";
import path from "path";

import { connectDB } from "./config/db.config.js";

import { tasksRouter } from "./tasks/tasks.routes.js";
import verifyToken from "./middlewares/auth-jwt.js";
import userRoutes from "./user/routes.js";

import { passwordRecoveryRoutes } from "./password-recovery/routes.js";
import { fileURLToPath } from "url";

const PORT = process.env.port || 3000;

const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

connectDB();

app.use(express.json());
app.use(express.static(path.join(__dirname, "../../client/public")));

const publicPath = path.join(__dirname, "../../client/public");

app.use("/api", userRoutes);
app.use("/api", tasksRouter);
app.use("/api", passwordRecoveryRoutes);

app.get("/", verifyToken, (req: Request, res: Response) => {
    res.sendFile(path.join(publicPath, "index.html"), (err) => {
        if (err) {
            console.error("Error sending file:", err);
            res.status(500).send("Could not load the main page.");
        }
    });
});

app.use((req, res, next) => {
    res.status(404).send("Sorry, can't find that route!");
});

app.listen(PORT, (error) => {
    if (error) {
        console.error("error occures");
    }
    console.log("server working at", PORT);
});

process.on("uncaughtException", (err, origin) => {
    console.error(`Uncaught Exception at ${origin}:`, err);
});
