import express from "express";

import { verifyToken } from "../utils/middleware/verifyToken.js";

// Módulos controladores importados
import { signIn } from "../controllers/signIn.js";
import { signUpUser } from "../controllers/signUpUser.js";
import { signUpStoreManager } from "../controllers/signUpStoreManager.js";
import { createStore } from "../controllers/createStore.js";

// Creación del enrutador 
const router = express.Router();

// Routes
router.post("/signIn", signIn);
router.post("/signUp/cliente", signUpUser);
router.route("/signUp/encargado").post(createStore).post(signUpStoreManager)

export default router;