import express from "express";
import { getHood, addHood, updateHood, deleteHood } from "../controllers/neighborhood.js";


const router = express.Router();

router.get("/", getHood)

router.get("/", addHood)

router.get("/:id", updateHood)

router.get("/:id", deleteHood)

export default router