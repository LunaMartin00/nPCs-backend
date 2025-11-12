import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import { PORT } from "./keys/keys.js";
import router from "./router/router.js";

export const app = express();

app.use(bodyParser.json());
app.use(cors());

app.use('/', router)

app.listen(PORT, () => console.log(`Servidor funcionando en: http://localhost:${PORT}`)
);