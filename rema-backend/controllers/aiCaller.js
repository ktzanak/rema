import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function suggestImprovements(recipeText) {
  const response = await openai.chat.completions.create({
    model: "gpt-3.5-turbo",
    messages: [
      { role: "system", content: "You're a helpful chef." },
      { role: "user", content: `Make this recipe healthier: ${recipeText}` },
    ],
  });

  return response.choices[0].message.content;
}
