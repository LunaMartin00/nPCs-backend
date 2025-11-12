import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import { PORT } from "./keys/keys";

export const app = express();

app.use(bodyParser.json());
app.use(cors());

app.listen(PORT, () => console.log(`Servidor funcionando en: http://localhost:${PORT}`)
);