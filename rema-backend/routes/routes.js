import express from "express";
import { addRecipe, listRecipes } from "../controllers/recipeController.js";

const router = express.Router();

router.get("/listrecipes", listRecipes);
router.post("/addrecipe", addRecipe);

export default router;
