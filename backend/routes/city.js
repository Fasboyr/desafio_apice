import express from "express";
import { getCity, addCity, updateCity, deleteCity } from "../controllers/city.js";


const CityRouter = express.Router();

CityRouter.get("/", getCity);
CityRouter.post("/", addCity);
CityRouter.put("/:id", updateCity);
CityRouter.delete("/:id", deleteCity);

export default CityRouter