import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;

console.log("🔍 Setting up server...");

// Middleware
app.use(helmet());
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    credentials: true,
  })
);
app.use(morgan("combined"));
app.use(express.json());

// Debug middleware
app.use((req, res, next) => {
  console.log(`📡 ${req.method} ${req.path}`);
  next();
});

// Health check
app.get("/health", (req, res) => {
  console.log("✅ Health check called");
  res.json({
    status: "OK",
    timestamp: new Date().toISOString(),
    message: "Tableau Clone API is running!",
  });
});

// Import and mount routes
try {
  console.log("🔍 Importing routes...");

  // Auth routes
  const authRoutes = require("./routes/auth");
  app.use("/api/auth", authRoutes.default || authRoutes);
  console.log("✅ Auth routes mounted");

  // Data routes
  const dataRoutes = require("./routes/data");
  app.use("/api/data", dataRoutes.default || dataRoutes);
  console.log("✅ Data routes mounted");
} catch (error) {
  console.error("❌ Failed to import routes:", error);
}

// 404 handler
app.use("*", (req, res) => {
  console.log("❌ 404 - Route not found:", req.method, req.originalUrl);
  res.status(404).json({ error: "Route not found" });
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/health`);
  console.log(`🔐 Auth endpoints: http://localhost:${PORT}/api/auth/*`);
  console.log(`📊 Data endpoints: http://localhost:${PORT}/api/data/*`);
});
