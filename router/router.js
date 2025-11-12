import express from "express";

import { verifyToken } from "../utils/middleware/verifyToken";

// Módulos controladores importados
import { signIn } from "../controllers/signIn";
import { signUp } from "../controllers/signUp";

// Creación del enrutador 
const router = express.Router();

// Routes
router.post("/signIn", signIn);
router.post("/signUp/cliente", signUp);

export default router;