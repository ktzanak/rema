import express from "express";
import {
  addrecipe,
  listrecipes,
  deleterecipe,
  updaterecipe,
} from "../controllers/recipeController.js";

const router = express.Router();

router.get("/listrecipes", listrecipes);
router.post("/addrecipe", addrecipe);
router.delete("/deleterecipe/:id", deleterecipe);
router.put("/updaterecipe/:id", updaterecipe);

export default router;
