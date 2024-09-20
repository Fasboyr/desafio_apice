import express from "express";
import { addSaleItem, deleteSaleItem, getSaleItems, updateSaleItem } from "../controllers/sale_itens.js";


const ItensRouter = express.Router();

ItensRouter.get("/", getSaleItems);
ItensRouter.post("/", addSaleItem);
ItensRouter.put("/:id_venda/:id_produto", updateSaleItem);
ItensRouter.delete("/:id_venda/:id_produto", deleteSaleItem);


export default ItensRouter