import express from "express";

import { connectDB } from "./config/db.config.js";

import authRoutes from "./auth/auth.routes.js";
import userRoutes from "./user/user.routes.js";

const PORT = process.env.port || 3000;

const app = express();

connectDB();

app.use(express.json());

app.use("/api", userRoutes);
app.use("/api", authRoutes);

app.get("/", (req, res) => {
    //front end starts!
    res.send("Home Page");
});

app.use((req, res, next) => {
    res.status(404).send("Sorry, can't find that route!");
});

app.listen(PORT, (error) => {
    if (error) {
        console.log("error occures");
    }
    console.log("server working at", PORT);
});

process.on("uncaughtException", (err, origin) => {
    console.error(`Uncaught Exception at ${origin}:`, err);
});
