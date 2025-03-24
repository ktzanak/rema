import dotenv from "dotenv";
dotenv.config();
import express from "express";
import mysql from "mysql2";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

let retryCount = 0;
const maxRetries = 3;

function handleDatabaseConnection() {
  const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT,
  });

  db.connect((err) => {
    if (err) {
      retryCount += 1;
      console.log(
        `Error connecting to MySQL, retrying in 5 seconds... (${retryCount}/${maxRetries})`
      );
      if (retryCount < maxRetries) {
        setTimeout(handleDatabaseConnection, 5000); // Retry after 5 seconds
      } else {
        console.log(
          "Max retries reached. Could not connect to MySQL database."
        );
      }
      return;
    }

    console.log("Connected to MySQL database");
  });

  return db;
}

const db = handleDatabaseConnection();

//app.get("/", (req, res) => {
//  res.send("Frontend, backend and database are running!");
//});

// Fetch data
app.get("/listrecipes", (req, res) => {
  db.query("SELECT * FROM recipes", (err, results) => {
    if (err) {
      res.status(500).json({ error: err.message });
    } else {
      res.json(results);
    }
  });
});

// Submit data
app.post("/addrecipe", (req, res) => {
  const {
    title,
    description,
    cooking_time,
    portions,
    ingredients = [],
    instructions = [],
    categories = [],
    tags = [],
  } = req.body;

  db.query(
    "INSERT INTO recipes (title,description,cooking_time,portions,created_at) VALUES (?,?,?,?,NOW())",
    [title, description, cooking_time, portions],
    (err, results) => {
      if (err) {
        res.status(500).json({ error: err.message });
      }

      const recipeId = results.insertId;

      // Insert ingredients into the `ingredients` table
      ingredients.forEach((ingredient) => {
        db.query(
          "INSERT INTO ingredients (recipe_id, ingredient) VALUES (?, ?)",
          [recipeId, ingredient],
          (err) => {
            if (err) {
              return res.status(500).json({ error: err.message });
            }
          }
        );
      });

      // Insert instructions into the `instructions` table
      instructions.forEach((instruction, index) => {
        db.query(
          "INSERT INTO instructions (recipe_id, step_number, instruction) VALUES (?, ?, ?)",
          [recipeId, index + 1, instruction],
          (err) => {
            if (err) {
              return res.status(500).json({ error: err.message });
            }
          }
        );
      });

      // Insert categories into the `categories` table and link them to the recipe
      categories.forEach((category) => {
        db.query(
          "INSERT INTO categories (name) VALUES (?) ON DUPLICATE KEY UPDATE id=id",
          [category],
          (err, categoryResult) => {
            if (err) {
              return res.status(500).json({ error: err.message });
            }

            const categoryId = categoryResult.insertId || categoryResult[0].id; // Get the existing or new category ID
            db.query(
              "INSERT INTO recipe_categories (recipe_id, category_id) VALUES (?, ?)",
              [recipeId, categoryId],
              (err) => {
                if (err) {
                  return res.status(500).json({ error: err.message });
                }
              }
            );
          }
        );
      });

      // Insert tags into the `tags` table and link them to the recipe
      tags.forEach((tag) => {
        db.query(
          "INSERT INTO tags (name) VALUES (?) ON DUPLICATE KEY UPDATE id=id",
          [tag],
          (err, tagResult) => {
            if (err) {
              return res.status(500).json({ error: err.message });
            }

            const tagId = tagResult.insertId || tagResult[0].id; // Get the existing or new tag ID
            db.query(
              "INSERT INTO recipe_tags (recipe_id, tag_id) VALUES (?, ?)",
              [recipeId, tagId],
              (err) => {
                if (err) {
                  return res.status(500).json({ error: err.message });
                }
              }
            );
          }
        );
      });

      // Return the recipe data along with the recipeId
      res.json({
        id: recipeId,
        title,
        description,
        cooking_time,
        portions,
      });
    }
  );
});

// Start server
const express_port = process.env.EXPRESS_PORT;
app.listen(express_port, () =>
  console.log(`Server running on port ${express_port}`)
);
