import dotenv from "dotenv";
dotenv.config();
import express from "express";
import mysql from "mysql2";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

// Retry count
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

// Routes
app.get("/", (req, res) => {
  res.send("Frontend, backend and database are running!");
});

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
app.post("/addrecipes", (req, res) => {
  const { title, description, cooking_time, portions, created_at } = req.body;

  db.query(
    "INSERT INTO recipes (id,title,description,cooking_time,portions,created_at) VALUES (?,?,?,?,?,?)",
    [id, title, description, cooking_time, portions, created_at],
    (err, results) => {
      if (err) {
        res.status(500).json({ error: err.message });
      } else {
        res.json({ id: results.insertId, title });
      }
    }
  );
});

// Start server
const express_port = process.env.EXPRESS_PORT;
app.listen(express_port, () =>
  console.log(`Server running on port ${express_port}`)
);
