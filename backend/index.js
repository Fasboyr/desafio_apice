import express from "express";
import cors from "cors";
import NeighborhoodRouter from "./routes/neighborhood.js";
import CityRouter from "./routes/city.js";
import PeopleRouter from "./routes/people.js";
import ProductRouter from "./routes/product.js";
import SaleRouter from "./routes/sale.js";
import ItensRouter from "./routes/sale_itens.js";

const app = express();

app.use(express.json());
app.use(cors());

app.use("/neighborhoods", NeighborhoodRouter);
app.use("/cities", CityRouter);
app.use("/people", PeopleRouter);
app.use("/products", ProductRouter);
app.use("/sales", SaleRouter);
app.use("/saleItens", ItensRouter);
app.listen(8800);