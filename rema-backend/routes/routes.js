import express from "express";
import {
  addrecipe,
  listrecipes,
  deleterecipe,
  updaterecipe,
  askai,
} from "../controllers/recipeController.js";

const router = express.Router();

router.get("/listrecipes", listrecipes);
router.post("/addrecipe", addrecipe);
router.delete("/deleterecipe/:recipeid", deleterecipe);
router.put("/updaterecipe/:recipeid", updaterecipe);
router.post("/askai/:recipeid", askai);

export default router;
