import express from "express";
import cors from "cors";
import hoodRoutes from "./routes/neighborhood.js";

const app = express();

app.use(express.json());
app.use(cors());

app.use("/", hoodRoutes)

app.listen(8800);