import dotenv from "dotenv";
dotenv.config();
import express from "express";
import mysql from "mysql2";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

// MySQL Connection
const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT,
});

db.connect((err) => {
  if (err) {
    console.error("Database connection failed:", err);
    return;
  }
  console.log("Connected to MySQL database");
});

// Routes
app.get("/", (req, res) => {
  res.send("Backend is running!");
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
  const { name } = req.body;
  if (!name) return res.status(400).json({ error: "Name is required" });

  db.query(
    "INSERT INTO recipes (id,title,description,cooking_time,portions,created_at) VALUES (?,?,?,?,?,?)",
    [id, title, description, cooking_time, portions, created_at],
    (err, results) => {
      if (err) {
        res.status(500).json({ error: err.message });
      } else {
        res.json({ id: results.insertId, name });
      }
    }
  );
});

// Start server
const express_port = process.env.EXPRESS_PORT;
app.listen(express_port, () =>
  console.log(`Server running on port ${express_port}`)
);
