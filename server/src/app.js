import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import { dirname } from "path";
import { fileURLToPath } from "url";
import path from "path";

// Get the root directory
const __dirname = dirname(fileURLToPath(import.meta.url));

// Load environment variables from .env file
dotenv.config({
  path: path.resolve(__dirname, "../.env"), // Go up one level to find the .env file
});

const app = express();

console.log(process.env.CORS_ORIGIN);

app.use(
  cors({
    origin:"http://localhost:3000",
    // origin: process.env.CORS_ORIGIN,
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));
app.use(cookieParser());

// importing the routes
import userRoutes from "./routes/user.routes.js";

// route declaration
app.use("/api/v1/users", userRoutes);

export { app };
