import express from "express";
import {
  addrecipe,
  listrecipes,
  deleterecipe,
  updaterecipe,
  raterecipe,
  askai,
  foodQuote,
  addtocalendar,
  deletefromcalendar,
  listcalendarmeals,
} from "../controllers/recipeController.js";

const router = express.Router();

router.get("/listrecipes", listrecipes);
router.post("/addrecipe", addrecipe);
router.delete("/deleterecipe/:recipeid", deleterecipe);
router.put("/updaterecipe/:recipeid", updaterecipe);
router.post("/raterecipe/:recipeid", raterecipe);
router.get("/ping-internet", async (req, res) => {
  try {
    const response = await fetch("https://www.google.com", { method: "HEAD" });
    res.json({ online: response.ok });
  } catch (err) {
    res.json({ online: false });
  }
});
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
router.post("/addtocalendar", addtocalendar);
router.delete(
  "/deletefromcalendar/:recipeid/:meal_date/:meal_time",
  deletefromcalendar
);
router.get("/listcalendarmeals", listcalendarmeals);

export default router;
