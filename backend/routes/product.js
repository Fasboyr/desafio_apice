import express from "express";
import { addProduct, deleteProduct, getProduct, updateProduct } from "../controllers/product.js";


const ProductRouter = express.Router();

ProductRouter.get("/", getProduct);
ProductRouter.post("/", addProduct);
ProductRouter.put("/:id", updateProduct);
ProductRouter.delete("/:id", deleteProduct);

export default ProductRouter