import path from "path";
import { fileURLToPath } from "url";

if (process.env.NODE_ENV !== "production") {
    await import("dotenv")
        .then((dotenv) => {
            const __filename = fileURLToPath(import.meta.url);
            const __dirname = path.dirname(__filename);

            dotenv.config({
                path: path.join(__dirname, "../../", "src/config", ".env"),
            });

            console.log(`Development mode: Loaded config from .env`);
        })
        .catch((err) => {
            console.warn(
                "Could not load local .env file. Running without local variables.",
                err
            );
        });
}
