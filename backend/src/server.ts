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

// Import and mount routes with better error handling
try {
  console.log("🔍 Importing auth routes...");
  const authRoutes = require("./routes/auth");
  app.use("/api/auth", authRoutes.default || authRoutes);
  console.log("✅ Auth routes mounted at /api/auth");
} catch (error) {
  console.error("❌ Failed to import auth routes:", error);
  console.error(
    "Error details:",
    error instanceof Error ? error.message : String(error)
  );
}

try {
  console.log("🔍 Importing data routes...");
  const dataRoutes = require("./routes/data");
  app.use("/api/data", dataRoutes.default || dataRoutes);
  console.log("✅ Data routes mounted at /api/data");
} catch (error) {
  console.error("❌ Failed to import data routes:", error);
  console.error(
    "Error details:",
    error instanceof Error ? error.message : String(error)
  );
}

try {
  console.log("🔍 Importing dashboard routes...");
  const dashboardRoutes = require("./routes/dashboard");
  app.use("/api/dashboard", dashboardRoutes.default || dashboardRoutes);
  console.log("✅ Dashboard routes mounted at /api/dashboard");
} catch (error) {
  console.error("❌ Failed to import dashboard routes:", error);
  console.error(
    "Error details:",
    error instanceof Error ? error.message : String(error)
  );
}
// Test route to verify dashboard mounting
app.get("/api/dashboard-test", (req, res) => {
  console.log("✅ Dashboard test route called");
  res.json({ message: "Dashboard routes are working!" });
});

// List all routes for debugging
app.get("/api/routes", (req, res) => {
  const routes: string[] = [];
  app._router.stack.forEach((middleware: any) => {
    if (middleware.route) {
      routes.push(
        `${Object.keys(middleware.route.methods)} ${middleware.route.path}`
      );
    } else if (middleware.name === "router") {
      middleware.handle.stack.forEach((handler: any) => {
        if (handler.route) {
          routes.push(
            `${Object.keys(handler.route.methods)} ${middleware.regexp.source
              .replace("\\", "")
              .replace("?", "")}${handler.route.path}`
          );
        }
      });
    }
  });
  res.json({ routes });
});

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
  console.log(
    `📋 Dashboard endpoints: http://localhost:${PORT}/api/dashboard/*`
  );
  console.log(`🔍 Debug routes: http://localhost:${PORT}/api/routes`);
});
