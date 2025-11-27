import express from "express";

import { verifyToken } from "../utils/middleware/verifyToken.js";

// Módulos controladores importados
import { signIn } from "../controllers/signIn.js";
import { signUpUser } from "../controllers/signUpUser.js";
import { signUpStoreManager } from "../controllers/signUpStoreManager.js";
import { addProduct } from "../controllers/addProducts.js";
import { getProductsByCategory } from "../controllers/getProductsByCategory.js";
import { searchProducts } from "../controllers/getProductsByCategory.js";
import { createBuild } from "../controllers/createBuild.js";
import { getAllBuilds } from "../controllers/getAllBuilds.js";
import { getBuildDetails } from "../controllers/getBuildDetails.js";
import { getUserBuilds } from "../controllers/getUserBuilds.js";

const router = express.Router();

// Routes
router.post("/signIn", signIn);
router.post("/signUp/cliente", signUpUser);
router.post("/signUp/tienda", signUpStoreManager);
router.post("/api/products", addProduct);
router.get("/products/:category", getProductsByCategory);
router.get("/search", searchProducts);
export default router;

router.post("/builds", verifyToken, createBuild);
router.get("/builds", getAllBuilds);
router.get("/builds/:id/details", getBuildDetails);
router.get("/builds/user/:id_cliente", verifyToken, getUserBuilds);