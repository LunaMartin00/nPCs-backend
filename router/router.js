import express from "express";

import { verifyToken } from "../utils/middleware/verifyToken.js";

// Módulos controladores importados
import { signIn } from "../controllers/signIn.js";
import { signUpUser } from "../controllers/signUpUser.js";
import { signUpStoreManager } from "../controllers/signUpStoreManager.js";
// import { addProduct } from "../controllers/addProduct.js";
import { getProductsByCategory } from "../controllers/getProductsByCategory.js";
import { searchProducts } from "../controllers/getProductsByCategory.js";

const router = express.Router();

// Routes
router.post("/signIn", signIn);
router.post("/signUp/cliente", signUpUser);
router.post("/signUp/tienda", signUpStoreManager);
// router.post("/addProduct", addProduct)
router.get("/products/:category", getProductsByCategory);
router.get("/search", searchProducts);
export default router;