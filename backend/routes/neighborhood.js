import express from "express";
import { getHood, addHood, updateHood, deleteHood } from "../controllers/neighborhood.js";


const router = express.Router();

router.get("/", getHood)

router.post("/", addHood)

router.put("/:id", updateHood)

router.delete("/:id", deleteHood)

export default router