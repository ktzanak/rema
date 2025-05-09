import pool from "../config/databaseconn.js";

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
        tag.tag
      FROM recipes rec
      LEFT JOIN ingredients ing ON rec.id = ing.recipe_id
      LEFT JOIN instructions ins ON rec.id = ins.recipe_id
      LEFT JOIN recipe_categories rc ON rec.id = rc.recipe_id
      LEFT JOIN categories cat ON rc.category_id = cat.id
      LEFT JOIN recipe_tags rt ON rec.id = rt.recipe_id
      LEFT JOIN tags tag ON rt.tag_id = tag.id
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
        });
      }

      const rec = recipeMap.get(recipe.recipe_id);

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

// Add a recipe and insert into recipe, ingredients, instructions, categories, tags, and their relationships within a transaction
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
    // Start a transaction
    await connection.beginTransaction();

    // Delete the recipe by ID
    await connection.query("DELETE FROM recipes WHERE id = ?", [recipeid]);

    // Commit the transaction
    await connection.commit();

    await cleanupOrphanedTagsAndCategories();

    res.status(200).json({ message: "Recipe deleted successfully." });
  } catch (error) {
    // Rollback the transaction in case of error
    await connection.rollback();
    console.error("Error deleting recipe:", error);
    res
      .status(500)
      .json({ message: "An error occurred while deleting the recipe." });
  } finally {
    // Release the connection back to the pool
    connection.release();
  }
};

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
    // 7. Find existing category ID for this recipe
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

    // 8. Get existing tag IDs for the recipe
    const [existingTags] = await connection.query(
      `SELECT t.id, t.tag 
              FROM tags t
              JOIN recipe_tags rt ON t.id = rt.tag_id
              WHERE rt.recipe_id = ?`,
      [recipeid]
    );

    // 9. Update or replace tags
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
