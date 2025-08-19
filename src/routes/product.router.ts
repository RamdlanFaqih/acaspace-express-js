import { Router } from "express";
import { addProduct, deleteProduct, editProduct, getProductById, getProducts } from "../controllers/product.controller";

const router = Router()

router.get("/", getProducts)
router.get("/:id", getProductById)
router.post("/", addProduct)
router.put("/:id", editProduct)
router.delete("/:id", deleteProduct)

export default router