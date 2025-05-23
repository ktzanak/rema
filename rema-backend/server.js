import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import routes from "./routes/routes.js";

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

// Use routes
app.use("/api", routes);

// Start server
const express_port = process.env.EXPRESS_PORT;
app.listen(express_port);
