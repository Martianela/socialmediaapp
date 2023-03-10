import express from "express";
import {
  getStories,
  addStories,
  deleteStories,
} from "../controllers/stories.js";

const router = express.Router();
router.get("/", getStories);
router.post("/", addStories);
router.delete("/", deleteStories);

export default router;
