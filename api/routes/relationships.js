import express from "express";
import {
  getRelation,
  addRelation,
  deleteRelation,
} from "../controllers/relationship.js";

const router = express.Router();
router.get("/", getRelation);
router.post("/", addRelation);
router.delete("/", deleteRelation);

export default router;
