import express from "express";
import { getHood, addHood, updateHood, deleteHood } from "../controllers/neighborhood.js";


const NeighborhoodRouter = express.Router();

NeighborhoodRouter.get("/", getHood);
NeighborhoodRouter.post("/", addHood);
NeighborhoodRouter.put("/:id", updateHood);
NeighborhoodRouter.delete("/:id", deleteHood);

export default NeighborhoodRouter