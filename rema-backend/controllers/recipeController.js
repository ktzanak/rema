import pool from "../config/databaseconn.js";
import { suggestImprovements } from "../controllers/aiCaller.js";

// Fetch all recipes
export const listrecipes = async (req, res) => {
  try {
    const [recipes] = await pool.query(`
     SELECT 
        rec.id AS recipe_id, 
        rec.title, 
        rec.description, 
        rec.cooking_time, 
        rec.portions, 
        rec.created_at,
        ing.id AS ingredient_id, 
        ing.ingredient,
        ins.id AS instruction_id, 
        ins.step_number, 
        ins.instruction,
        cat.id AS category_id,
        cat.category,
        tag.id AS tag_id,
        tag.tag,
        rat.id AS rating_id,
        rat.rating
      FROM recipes rec
      LEFT JOIN ingredients ing ON rec.id = ing.recipe_id
      LEFT JOIN instructions ins ON rec.id = ins.recipe_id
      LEFT JOIN recipe_categories rc ON rec.id = rc.recipe_id
      LEFT JOIN categories cat ON rc.category_id = cat.id
      LEFT JOIN recipe_tags rt ON rec.id = rt.recipe_id
      LEFT JOIN tags tag ON rt.tag_id = tag.id
      LEFT JOIN ratings rat ON rec.id = rat.recipe_id
      ORDER BY rec.title
    `);

    const recipeMap = new Map();

    for (const recipe of recipes) {
      if (!recipeMap.has(recipe.recipe_id)) {
        recipeMap.set(recipe.recipe_id, {
          id: recipe.recipe_id,
          title: recipe.title,
          description: recipe.description,
          cooking_time: recipe.cooking_time,
          portions: recipe.portions,
          created_at: recipe.created_at,
          ingredients: [],
          instructions: [],
          tags: [],
          category: recipe.category,
          rating: recipe.rating !== null ? Number(recipe.rating) : null,
        });
      }

      const rec = recipeMap.get(recipe.recipe_id);
      // Avoid duplicate ingredients, instructions, and tags
      if (
        recipe.ingredient_id &&
        !rec.ingredients.some((i) => i.id === recipe.ingredient_id)
      ) {
        rec.ingredients.push({
          id: recipe.ingredient_id,
          ingredient: recipe.ingredient,
        });
      }
      if (
        recipe.instruction_id &&
        !rec.instructions.some((i) => i.id === recipe.instruction_id)
      ) {
        rec.instructions.push({
          id: recipe.instruction_id,
          step_number: recipe.step_number,
          instruction: recipe.instruction,
        });
      }
      if (recipe.tag && !rec.tags.some((i) => i.id === recipe.tag_id)) {
        rec.tags.push({
          id: recipe.tag_id,
          tag: recipe.tag,
        });
      }
    }

    const recipesWithDetails = Array.from(recipeMap.values());

    res.status(200).json(recipesWithDetails);
  } catch (err) {
    console.error("Error fetching recipes:", err.message);
    res.status(500).json({ error: err.message });
  }
};

// Add a recipe and its relationships within a transaction
export const addrecipe = async (req, res) => {
  const {
    title,
    description,
    cooking_time,
    portions,
    created_at,
    ingredients,
    instructions,
    category,
    tags,
  } = req.body;

  const connection = await pool.getConnection();

  try {
    await connection.beginTransaction();

    // Step 1: Insert the recipe into the 'recipes' table
    const [recipeResult] = await connection.query(
      "INSERT INTO recipes (title, description, cooking_time, portions, created_at) VALUES (?, ?, ?, ?, ?)",
      [title, description, cooking_time, portions, created_at]
    );
    const recipeId = recipeResult.insertId;

    // Step 2: Insert ingredients for the recipe into the 'ingredients' table
    for (const ingredientrow of ingredients) {
      await connection.query(
        "INSERT INTO ingredients (recipe_id, ingredient) VALUES (?, ?)",
        [recipeId, ingredientrow.ingredient]
      );
    }

    // Step 3: Insert instructions for the recipe into the 'instructions' table
    for (const instructionrow of instructions) {
      await connection.query(
        "INSERT INTO instructions (recipe_id, step_number, instruction) VALUES (?, ?, ?)",
        [recipeId, instructionrow.step_number, instructionrow.instruction]
      );
    }

    // Step 4: Insert and link categories to the recipe
    let categoryId;
    const [existingCategoryRows] = await connection.query(
      "SELECT id FROM categories WHERE category = ?",
      [category]
    );

    if (existingCategoryRows.length > 0) {
      categoryId = existingCategoryRows[0].id;
    } else {
      const [categoryResult] = await connection.query(
        "INSERT INTO categories (category) VALUES (?)",
        [category]
      );
      categoryId = categoryResult.insertId;
    }
    await connection.query(
      "INSERT INTO recipe_categories (recipe_id, category_id) VALUES (?, ?)",
      [recipeId, categoryId]
    );

    // Step 5: Parse, insert and link tags to the recipe
    const parsedTags = Array.isArray(tags)
      ? tags.map((t) => (typeof t === "string" ? t.trim() : t.tag?.trim()))
      : tags.split(",").map((t) => t.trim());

    for (const tag of parsedTags) {
      let tagId;

      // Check if the tag already exists
      const [existingTagRows] = await connection.query(
        "SELECT id FROM tags WHERE tag = ?",
        [tag]
      );

      if (existingTagRows.length > 0) {
        tagId = existingTagRows[0].id;
      } else {
        const [tagResult] = await connection.query(
          "INSERT INTO tags (tag) VALUES (?)",
          [tag]
        );
        tagId = tagResult.insertId;
      }
      await connection.query(
        "INSERT INTO recipe_tags (recipe_id, tag_id) VALUES (?, ?)",
        [recipeId, tagId]
      );
    }

    await connection.commit();
    res.status(201).json({ message: "Recipe added successfully!", recipeId });
  } catch (err) {
    await connection.rollback();
    res.status(500).json({ error: err.message });
  } finally {
    connection.release();
  }
};

// Clean orphaned tags and categories
const cleanupOrphanedTagsAndCategories = async () => {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();

    await connection.query(`
      DELETE FROM tags
      WHERE id NOT IN (SELECT DISTINCT tag_id FROM recipe_tags)
    `);

    await connection.query(`
      DELETE FROM categories
      WHERE id NOT IN (SELECT DISTINCT category_id FROM recipe_categories)
    `);

    await connection.commit();
  } catch (error) {
    await connection.rollback();
    console.error("Cleanup error:", error.message);
  } finally {
    connection.release();
  }
};

export const deleterecipe = async (req, res) => {
  const { recipeid } = req.params;
  const connection = await pool.getConnection();

  try {
    await connection.beginTransaction();

    // Delete the recipe
    await connection.query("DELETE FROM recipes WHERE id = ?", [recipeid]);
    await connection.commit();

    // Clean up any tags/categories that are no longer in use
    await cleanupOrphanedTagsAndCategories();

    res.status(200).json({ message: "Recipe deleted successfully." });
  } catch (error) {
    await connection.rollback();
    console.error("Error deleting recipe:", error);
    res
      .status(500)
      .json({ message: "An error occurred while deleting the recipe." });
  } finally {
    connection.release();
  }
};

// Create/update rating of recipe
export const raterecipe = async (req, res) => {
  const connection = await pool.getConnection();
  const { recipeid } = req.params;
  const { newRating } = req.body;

  try {
    await connection.beginTransaction();
    // Check if the rating already exists for the recipe
    const [existingrating] = await connection.query(
      "SELECT id FROM ratings WHERE recipe_id = ?",
      [recipeid]
    );

    if (existingrating.length > 0) {
      await connection.query(
        "UPDATE ratings SET rating = ? WHERE recipe_id = ?",
        [newRating, recipeid]
      );
    } else {
      await connection.query(
        "INSERT INTO ratings (recipe_id, rating) VALUES (?, ?)",
        [recipeid, newRating]
      );
    }

    await connection.commit();
    res.status(201).json({ message: "Rating added successfully." });
  } catch (err) {
    await connection.rollback();
    console.error("Error inserting rating:", err.message);
    res.status(500).json({ error: err.message });
  } finally {
    connection.release();
  }
};

// Update an existing recipe along with all associated data
export const updaterecipe = async (req, res) => {
  const { recipeid } = req.params;
  const {
    title,
    description,
    cooking_time,
    portions,
    ingredients,
    instructions,
    category,
    tags,
  } = req.body;

  const connection = await pool.getConnection();

  try {
    await connection.beginTransaction();

    // 1. Update recipe table
    await connection.query(
      `UPDATE recipes 
       SET title = ?, description = ?, cooking_time = ?, portions = ?
       WHERE id = ?`,
      [title, description, cooking_time, portions, recipeid]
    );

    // 2. Delete existing ingredients
    await connection.query("DELETE FROM ingredients WHERE recipe_id = ?", [
      recipeid,
    ]);

    // 3. Re-insert updated ingredients
    for (const ingredientrow of ingredients) {
      await connection.query(
        "INSERT INTO ingredients (recipe_id, ingredient) VALUES (?, ?)",
        [recipeid, ingredientrow.ingredient]
      );
    }

    // 4. Delete existing instructions
    await connection.query("DELETE FROM instructions WHERE recipe_id = ?", [
      recipeid,
    ]);

    // 5. Re-insert updated instructions
    for (const instructionrow of instructions) {
      await connection.query(
        "INSERT INTO instructions (recipe_id, step_number, instruction) VALUES (?, ?, ?)",
        [recipeid, instructionrow.step_number, instructionrow.instruction]
      );
    }
    // 6. Find existing category ID for this recipe
    const [oldCategoryRows] = await connection.query(
      ` SELECT c.id, c.category 
            FROM categories c
            JOIN recipe_categories rc ON c.id = rc.category_id
            WHERE rc.recipe_id = ?`,
      [recipeid]
    );

    if (oldCategoryRows.length > 0) {
      const oldCategory = oldCategoryRows[0].category;

      if (oldCategory !== category) {
        // Check if the new category name already exists
        const [existingNewCat] = await connection.query(
          "SELECT id FROM categories WHERE category = ?",
          [category]
        );

        let newCategoryId;
        if (existingNewCat.length > 0) {
          newCategoryId = existingNewCat[0].id;
        } else {
          const [newCatInsert] = await connection.query(
            "INSERT INTO categories (category) VALUES (?)",
            [category]
          );
          newCategoryId = newCatInsert.insertId;
        }

        // Update recipe_categories with new category_id
        await connection.query(
          "UPDATE recipe_categories SET category_id = ? WHERE recipe_id = ?",
          [newCategoryId, recipeid]
        );
      }
    }

    // 7. Get existing tag IDs for the recipe
    const [existingTags] = await connection.query(
      `SELECT t.id, t.tag 
              FROM tags t
              JOIN recipe_tags rt ON t.id = rt.tag_id
              WHERE rt.recipe_id = ?`,
      [recipeid]
    );

    // 8. Update or replace tags
    await connection.query("DELETE FROM recipe_tags WHERE recipe_id = ?", [
      recipeid,
    ]);

    const parsedTags = Array.isArray(tags)
      ? tags.map((t) => (typeof t === "string" ? t.trim() : t.tag?.trim()))
      : tags.split(",").map((t) => t.trim());

    for (const newTag of parsedTags) {
      // Check if a tag with the new name already exists
      const [existingNewTag] = await connection.query(
        "SELECT id FROM tags WHERE tag = ?",
        [newTag]
      );

      let tagId;

      if (existingNewTag.length > 0) {
        tagId = existingNewTag[0].id;
      } else {
        const [tagResult] = await connection.query(
          "INSERT INTO tags (tag) VALUES (?)",
          [newTag]
        );
        tagId = tagResult.insertId;
      }

      await connection.query(
        "INSERT INTO recipe_tags (recipe_id, tag_id) VALUES (?, ?)",
        [recipeid, tagId]
      );
    }

    await connection.commit();

    // Clean up any tags/categories that are no longer in use
    await cleanupOrphanedTagsAndCategories();
    res.status(200).json({ message: "Recipe updated successfully." });
  } catch (error) {
    await connection.rollback();
    console.error("Error updating recipe:", error.message);
    res.status(500).json({ error: error.message });
  } finally {
    connection.release();
  }
};

// Fetch all relevant info of recipe and structure it for AI-based processing
export const getRecipeByIdForAI = async (recipeid) => {
  const [recipes] = await pool.query(
    `
    SELECT 
      rec.id AS recipe_id, 
      rec.title, 
      rec.description, 
      rec.cooking_time, 
      rec.portions, 
      rec.created_at,
      ing.id AS ingredient_id, 
      ing.ingredient,
      ins.id AS instruction_id, 
      ins.step_number, 
      ins.instruction,
      cat.id AS category_id,
      cat.category,
      tag.id AS tag_id,
      tag.tag
    FROM recipes rec
    LEFT JOIN ingredients ing ON rec.id = ing.recipe_id
    LEFT JOIN instructions ins ON rec.id = ins.recipe_id
    LEFT JOIN recipe_categories rc ON rec.id = rc.recipe_id
    LEFT JOIN categories cat ON rc.category_id = cat.id
    LEFT JOIN recipe_tags rt ON rec.id = rt.recipe_id
    LEFT JOIN tags tag ON rt.tag_id = tag.id
    WHERE rec.id = ?
    ORDER BY ins.step_number
    `,
    [recipeid]
  );

  if (recipes.length === 0) return null;

  const recipe = recipes[0];
  const recipeDetails = {
    id: recipe.recipe_id,
    title: recipe.title,
    description: recipe.description,
    cooking_time: recipe.cooking_time,
    portions: recipe.portions,
    created_at: recipe.created_at,
    ingredients: [],
    instructions: [],
    tags: [],
    category: recipe.category,
  };

  for (const row of recipes) {
    if (
      row.ingredient_id &&
      !recipeDetails.ingredients.some((i) => i.id === row.ingredient_id)
    ) {
      recipeDetails.ingredients.push({
        id: row.ingredient_id,
        ingredient: row.ingredient,
      });
    }
    if (
      row.instruction_id &&
      !recipeDetails.instructions.some((i) => i.id === row.instruction_id)
    ) {
      recipeDetails.instructions.push({
        id: row.instruction_id,
        step_number: row.step_number,
        instruction: row.instruction,
      });
    }
    if (row.tag_id && !recipeDetails.tags.some((i) => i.id === row.tag_id)) {
      recipeDetails.tags.push({
        id: row.tag_id,
        tag: row.tag,
      });
    }
  }

  return recipeDetails;
};

// Generate AI-based suggestions for a given recipe
export const askai = async (req, res) => {
  const { recipeid } = req.params;
  const aimode = req.query.aimode || "healthier";
  try {
    const recipe = await getRecipeByIdForAI(recipeid);

    if (!recipe) {
      return res.status(404).json({ error: "Recipe not found" });
    }

    const suggestions = await suggestImprovements(recipe, aimode);
    res.json(suggestions);
  } catch (error) {
    console.error("AI error:", error.message);
    res.status(500).json({ error: "Failed to get AI suggestions" });
  }
};

// Get food-related quotes from spoonacular or use the fallback ones
export const foodQuote = async (req, res) => {
  const fqkey = process.env.QUOTES_API_KEY;
  const fallbackJokes = [
    "I followed my heart — and it led me to the fridge.",
    "I'm on a seafood diet. I see food and I eat it.",
    "My favorite exercise is a cross between a lunge and a crunch. I call it lunch.",
    "You can't live a full life on an empty stomach.",
    "Don’t be upsetti — eat some spaghetti.",
    "Stressed spelled backwards is desserts.",
    "Why do we cook bacon and bake cookies?",
    "Cooking is love made visible.",
    "Life is uncertain. Eat dessert first.",
    "A recipe has no soul. You as the cook must bring soul to the recipe.",
    "The secret ingredient is always cheese.",
    "First we eat, then we do everything else.",
    "Good food is good mood.",
    "Cooking is like painting or writing a song.",
    "A messy kitchen is a sign of happiness.",
    "You don’t need a silver fork to eat good food.",
  ];

  const getFallback = () =>
    fallbackJokes[Math.floor(Math.random() * fallbackJokes.length)];

  try {
    if (!fqkey || fqkey.trim() === "") {
      return res.json({ quote: getFallback() });
    }

    const response = await fetch(
      `https://api.spoonacular.com/food/jokes/random?apiKey=${fqkey}`
    );

    if (!response.ok) {
      throw new Error(
        `Spoonacular API responded with status ${response.status}`
      );
    }

    const data = await response.json();

    if (!data?.text || data.text.length > 160) {
      return res.json({ quote: getFallback() });
    }

    res.json({ quote: data.text });
  } catch (err) {
    console.error("Error fetching Spoonacular joke:", err.message);
    res.json({ quote: getFallback() });
  }
};

//add meal to calendar
export const addtocalendar = async (req, res) => {
  const { recipe_id, meal_date, meal_time } = req.body;
  try {
    await pool.query(
      `INSERT INTO calendar_meals (recipe_id, meal_date, meal_time)
       VALUES (?, ?, ?)
       ON DUPLICATE KEY UPDATE recipe_id = VALUES(recipe_id)`,
      [recipe_id, meal_date, meal_time]
    );
    res.status(200).json({ message: "Recipe added to calendar." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to add recipe to calendar." });
  }
};

//delete meal from calendar
export const deletefromcalendar = async (req, res) => {
  const { recipeid, meal_date, meal_time } = req.params;
  try {
    await pool.query(
      `DELETE FROM calendar_meals
       WHERE recipe_id = ? AND meal_date = ? AND meal_time = ?`,
      [recipeid, meal_date, meal_time]
    );
    res.status(200).json({ message: "Recipe removed from calendar." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to remove recipe from calendar." });
  }
};

//list the calendar meals
export const listcalendarmeals = async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT 
        cm.id,
        cm.meal_date,
        cm.meal_time,
        rec.id AS recipe_id,
        rec.title,
        rec.description,
        rec.cooking_time,
        rec.portions,
        rec.created_at,
        ing.id AS ingredient_id,
        ing.ingredient,
        ins.id AS instruction_id,
        ins.step_number,
        ins.instruction,
        cat.id AS category_id,
        cat.category,
        tag.id AS tag_id,
        tag.tag,
        rat.id AS rating_id,
        rat.rating
      FROM calendar_meals cm
      JOIN recipes rec ON cm.recipe_id = rec.id
      LEFT JOIN ingredients ing ON rec.id = ing.recipe_id
      LEFT JOIN instructions ins ON rec.id = ins.recipe_id
      LEFT JOIN recipe_categories rc ON rec.id = rc.recipe_id
      LEFT JOIN categories cat ON rc.category_id = cat.id
      LEFT JOIN recipe_tags rt ON rec.id = rt.recipe_id
      LEFT JOIN tags tag ON rt.tag_id = tag.id
      LEFT JOIN ratings rat ON rec.id = rat.recipe_id
      ORDER BY cm.meal_date, cm.meal_time `
    );

    const mealMap = new Map();

    for (const row of rows) {
      const key = `${row.id}`;

      if (!mealMap.has(key)) {
        mealMap.set(key, {
          id: row.id,
          meal_date: row.meal_date,
          meal_time: row.meal_time,
          recipe: {
            id: row.recipe_id,
            title: row.title,
            description: row.description,
            cooking_time: row.cooking_time,
            portions: row.portions,
            created_at: row.created_at,
            ingredients: [],
            instructions: [],
            tags: [],
            category: row.category,
            rating: row.rating !== null ? Number(row.rating) : null,
          },
        });
      }

      const recipe = mealMap.get(key).recipe;

      if (
        row.ingredient_id &&
        !recipe.ingredients.some((i) => i.id === row.ingredient_id)
      ) {
        recipe.ingredients.push({
          id: row.ingredient_id,
          ingredient: row.ingredient,
        });
      }

      if (
        row.instruction_id &&
        !recipe.instructions.some((i) => i.id === row.instruction_id)
      ) {
        recipe.instructions.push({
          id: row.instruction_id,
          step_number: row.step_number,
          instruction: row.instruction,
        });
      }

      if (row.tag_id && !recipe.tags.some((t) => t.id === row.tag_id)) {
        recipe.tags.push({
          id: row.tag_id,
          tag: row.tag,
        });
      }
    }

    const calendarMeals = Array.from(mealMap.values());
    res.status(200).json(calendarMeals);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to retrieve calendar." });
  }
};
