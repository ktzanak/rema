import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

function formatRecipeForAI(recipe) {
  const ingredients = recipe.ingredients
    .map((i) => `- ${i.ingredient}`)
    .join("\n");
  const instructions = recipe.instructions
    .sort((a, b) => a.step_number - b.step_number)
    .map((i) => `${i.step_number}. ${i.instruction}`)
    .join("\n");
  const tags = recipe.tags.map((t) => `#${t.tag}`).join(" ");
  const category = recipe.category ? `Category: ${recipe.category}` : "";

  return `
Title: ${recipe.title}
Description: ${recipe.description}
Cooking Time: ${recipe.cooking_time} minutes
Portions: ${recipe.portions}
${category}
Tags: ${tags}

Ingredients:
${ingredients}

Instructions:
${instructions}
`.trim();
}

export async function suggestImprovements(recipeText, aimode) {
  const formatted = formatRecipeForAI(recipeText);
  const prompt =
    aimode === "tastier"
      ? `Improve the taste of this recipe:\n\n${formatted}`
      : `Make this recipe healthier:\n\n${formatted}`;

  const response = await openai.chat.completions.create({
    model: "gpt-3.5-turbo",
    messages: [
      {
        role: "system",
        content: "You're a helpful chef. Suggest how to improve a recipe.",
      },
      { role: "user", content: prompt },
    ],
  });

  return response.choices[0].message.content;
}
