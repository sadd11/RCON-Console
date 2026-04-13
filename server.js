import express from "express";
import cors from "cors";
import { Rcon } from "rcon-client";

const app = express();
app.use(cors());
app.use(express.json());

const RCON_HOST = ""185.9.145.8:25843;
const RCON_PORT = 25575; 
const RCON_PASSWORD = "358856";

// Маршрут для выполнения команд
app.post("/rcon", async (req, res) => {
    const { command } = req.body;

    if (!command || typeof command !== "string") {
        return res.status(400).json({ ok: false, error: "Команда не указана" });
    }

    try {
        const rcon = await Rcon.connect({
            host: RCON_HOST,
            port: RCON_PORT,
            password: RCON_PASSWORD,
        });

        const response = await rcon.send(command);
        rcon.end();

        res.json({ ok: true, response });
    } catch (err) {
        res.json({ ok: false, error: err.message });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("RCON backend запущен на порту " + PORT));
