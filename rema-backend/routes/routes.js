import express from "express";
import { addrecipe, listrecipes } from "../controllers/recipeController.js";

const router = express.Router();

router.get("/listrecipes", listrecipes);
router.post("/addrecipe", addrecipe);

export default router;
