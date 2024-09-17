import express from "express";
import { addPeople, deletePeople, getPeople, updatePeople } from "../controllers/people.js";


const PeopleRouter = express.Router();

PeopleRouter.get("/", getPeople);
PeopleRouter.post("/", addPeople);
PeopleRouter.put("/:id", updatePeople);
PeopleRouter.delete("/:id", deletePeople);

export default PeopleRouter