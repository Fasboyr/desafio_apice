import express from "express";
import { addSale, deleteSale, getSale, updateSale } from "../controllers/sale.js";



const SaleRouter = express.Router();

SaleRouter.get("/", getSale );
SaleRouter.post("/", addSale);
SaleRouter.put("/:id", updateSale );
SaleRouter.delete("/:id", deleteSale);

export default SaleRouter