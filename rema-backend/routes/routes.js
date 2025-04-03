import express from "express";
import {
  addrecipe,
  listrecipes,
  deleterecipe,
} from "../controllers/recipeController.js";

const router = express.Router();

router.get("/listrecipes", listrecipes);
router.post("/addrecipe", addrecipe);
router.delete("/deleterecipe/:id", deleterecipe);

export default router;
