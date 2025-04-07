import pool from "../config/databaseconn.js";

// Fetch all recipes
export const listrecipes = async (req, res) => {
  try {
    const [recipes] = await pool.query("SELECT * FROM recipes");
    const recipeIds = recipes.map((r) => r.id);

    const [ingredients] = await pool.query(
      "SELECT recipe_id, ingredient FROM ingredients WHERE recipe_id IN (?)",
      [recipeIds]
    );
    const [instructions] = await pool.query(
      "SELECT recipe_id, step_number, instruction FROM instructions WHERE recipe_id IN (?)",
      [recipeIds]
    );

    // Map ingredients and instructions to their recipes
    const recipesWithDetails = recipes.map((recipe) => {
      return {
        ...recipe,
        ingredients: ingredients
          .filter((ing) => ing.recipe_id === recipe.id)
          .map((i) => i.ingredient),
        instructions: instructions
          .filter((ins) => ins.recipe_id === recipe.id)
          .sort((a, b) => a.step_number - b.step_number),
      };
    });
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
    //categories,
    //tags,
  } = req.body;

  const connection = await pool.getConnection();

  try {
    // Start the transaction
    await connection.beginTransaction();

    // Step 1: Insert the recipe into the 'recipes' table
    const [recipeResult] = await connection.query(
      "INSERT INTO recipes (title, description, cooking_time, portions, created_at) VALUES (?, ?, ?, ?, ?)",
      [title, description, cooking_time, portions, created_at]
    );
    const recipeId = recipeResult.insertId;

    // Step 2: Insert ingredients for the recipe into the 'ingredients' table
    for (const ingredient of ingredients) {
      await connection.query(
        "INSERT INTO ingredients (recipe_id, ingredient) VALUES (?, ?)",
        [recipeId, ingredient.name]
      );
    }

    // Step 3: Insert instructions for the recipe into the 'instructions' table
    for (const instruction of instructions) {
      await connection.query(
        "INSERT INTO instructions (recipe_id, step_number, instruction) VALUES (?, ?, ?)",
        [recipeId, instruction.step_number, instruction.name]
      );
    }

    // Step 4: Insert and link categories to the recipe
    /*for (const category of categories) {
      const [categoryResult] = await connection.query(
        "INSERT INTO categories (name) VALUES (?) ON DUPLICATE KEY UPDATE id=id",
        [category]
      );
      const categoryId = categoryResult.insertId || categoryResult[0].id;

      await connection.query(
        "INSERT INTO recipe_categories (recipe_id, category_id) VALUES (?, ?)",
        [recipeId, categoryId]
      );
    }*/

    // Step 5: Insert and link tags to the recipe
    /*for (const tag of tags) {
      const [tagResult] = await connection.query(
        "INSERT INTO tags (name) VALUES (?) ON DUPLICATE KEY UPDATE id=id",
        [tag]
      );
      const tagId = tagResult.insertId || tagResult[0].id;

      await connection.query(
        "INSERT INTO recipe_tags (recipe_id, tag_id) VALUES (?, ?)",
        [recipeId, tagId]
      );
    }
*/
    await connection.commit();
    res.status(201).json({ message: "Recipe added successfully!", recipeId });
  } catch (err) {
    // Rollback the transaction in case of error
    await connection.rollback();
    res.status(500).json({ error: err.message });
  } finally {
    // Release the connection back to the pool
    connection.release();
  }
};

export const deleterecipe = async (req, res) => {
  const { id } = req.params;
  const connection = await pool.getConnection();

  try {
    // Start a transaction
    await connection.beginTransaction();

    // Delete the recipe by ID
    const [result] = await connection.query(
      "DELETE FROM recipes WHERE id = ?",
      [id]
    );

    // Commit the transaction
    await connection.commit();
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
