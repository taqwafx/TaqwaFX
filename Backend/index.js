import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
import fs from "fs";
import { connectDB } from "./db/db.js";

// Load environment variables
dotenv.config();

// Express app
const app = express();

// Fix __dirname for ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middlewares
if (process.env.NODE_ENV !== "production") {
  app.use(
    cors({
      origin: "http://localhost:5173",
      credentials: true,
    })
  );
}
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(cookieParser());

// Import routes
import userRouter from "./routes/user.routes.js";
import planRouter from "./routes/plan.routes.js";
import investmentRouter from "./routes/investment.routes.js";

// API routes
app.use("/api/v1/user", userRouter);
app.use("/api/v1/plan", planRouter);
app.use("/api/v1/investment", investmentRouter);

// ---- Serve React (Vite build) ----
const clientDistPath = path.join(__dirname, "../Client/dist");

if (fs.existsSync(clientDistPath)) {
  // Serve static files from Vite's dist folder
  app.use(express.static(clientDistPath));

  // Handle all remaining routes by sending index.html
  app.get(/.*/, (req, res) => {
    res.sendFile(path.join(clientDistPath, "index.html"));
  });
} else {
  console.log("⚠️  Vite dist folder not found. Run `npm run build` in /client first.");
}

// Error handler
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  return res.status(statusCode).json({
    success: false,
    message: err.message || "Internal Server Error",
    errors: err.errors || [],
    data: null,
    stack: process.env.NODE_ENV === "production" ? undefined : err.stack,
  });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, (err) => {
  connectDB();
  if (err) {
    console.log("❌ Something went wrong!...", err);
    return;
  }
  console.log(`✅ App running on http://localhost:${PORT}`);
});
