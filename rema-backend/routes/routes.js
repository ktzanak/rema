import express from "express";
import {
  addrecipe,
  listrecipes,
  deleterecipe,
  updaterecipe,
  raterecipe,
  askai,
  foodQuote,
} from "../controllers/recipeController.js";

const router = express.Router();

router.get("/listrecipes", listrecipes);
router.post("/addrecipe", addrecipe);
router.delete("/deleterecipe/:recipeid", deleterecipe);
router.put("/updaterecipe/:recipeid", updaterecipe);
router.post("/raterecipe/:recipeid", raterecipe);
router.post("/askai/:recipeid", askai);
router.get("/hasFoodQuotesKey", (req, res) => {
  if (process.env.QUOTES_API_KEY && process.env.QUOTES_API_KEY.trim() !== "") {
    res.json({ ok: true });
  } else {
    res.json({ ok: false });
  }
});
router.get("/foodQuote", foodQuote);
router.get("/hasOpenaiKey", (req, res) => {
  if (process.env.OPENAI_API_KEY && process.env.OPENAI_API_KEY.trim() !== "") {
    res.json({ ok: true });
  } else {
    res.json({ ok: false });
  }
});

export default router;
