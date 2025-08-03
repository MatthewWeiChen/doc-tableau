const express = require("express");
const { GoogleSheetsService } = require("../services/googleSheets");

const router = express.Router();

console.log("📊 Data routes file loaded");

const googleSheetsService = new GoogleSheetsService();

// Test connection endpoint
router.get("/test-connection/:sheetId", async (req: any, res: any) => {
  try {
    console.log("🧪 Testing connection to:", req.params.sheetId);

    const success = await googleSheetsService.testConnection(
      req.params.sheetId
    );

    if (success) {
      res.json({ success: true, message: "Connection successful!" });
    } else {
      res.status(400).json({ success: false, message: "Connection failed" });
    }
  } catch (error) {
    console.error("❌ Connection test error:", error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

// Get sheet information (list of available sheets)
router.get("/sheet-info/:sheetId", async (req: any, res: any) => {
  try {
    console.log("📊 Getting sheet info for:", req.params.sheetId);

    const info = await googleSheetsService.getSheetInfo(req.params.sheetId);

    console.log("✅ Sheet info retrieved");
    res.json(info);
  } catch (error) {
    console.error("❌ Error getting sheet info:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Failed to get sheet info";
    res.status(500).json({ error: errorMessage });
  }
});

// Get sheet data with optional sheet name
router.get("/sheet/:sheetId", async (req: any, res: any) => {
  try {
    console.log("📊 Getting sheet data for:", req.params.sheetId);

    const { sheetName, range } = req.query;
    console.log("📋 Sheet name:", sheetName || "default");
    console.log("📏 Range:", range || "A1:Z1000");

    const data = await googleSheetsService.getSheetData(
      req.params.sheetId,
      sheetName as string,
      range as string
    );

    console.log("✅ Sheet data retrieved");
    res.json(data);
  } catch (error) {
    console.error("❌ Error getting sheet data:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Failed to get sheet data";
    res.status(500).json({ error: errorMessage });
  }
});

// Keep the test endpoint for debugging
router.get("/test", (req: any, res: any) => {
  console.log("📊 Test route called");
  const testData = {
    headers: ["Product", "Sales", "Region"],
    data: [{ Product: "Test Product", Sales: "100", Region: "Test Region" }],
  };
  res.json(testData);
});

// Add this debug route
router.get("/debug/:sheetId", async (req: any, res: any) => {
  try {
    console.log("🔍 Debug: Starting authentication test...");
    console.log(
      "🔍 Debug: Service account file path:",
      process.env.GOOGLE_SERVICE_ACCOUNT_KEY_FILE
    );

    // Check if file exists
    const fs = require("fs");
    const filePath = process.env.GOOGLE_SERVICE_ACCOUNT_KEY_FILE;

    if (!fs.existsSync(filePath)) {
      return res.status(500).json({
        error: "Service account file not found",
        path: filePath,
      });
    }

    console.log("✅ Debug: Service account file exists");

    // Try to read the file
    const serviceAccount = JSON.parse(fs.readFileSync(filePath, "utf8"));
    console.log(
      "✅ Debug: Service account email:",
      serviceAccount.client_email
    );

    // Try basic authentication
    const { GoogleAuth } = require("google-auth-library");
    const auth = new GoogleAuth({
      keyFile: filePath,
      scopes: ["https://www.googleapis.com/auth/spreadsheets.readonly"],
    });

    console.log("🔍 Debug: Getting auth client...");
    const authClient = await auth.getClient();
    console.log("✅ Debug: Auth client created successfully");

    res.json({
      success: true,
      serviceAccountEmail: serviceAccount.client_email,
      message: "Authentication setup is working!",
    });
  } catch (error) {
    console.error("❌ Debug error:", error);
    res.status(500).json({
      error: error instanceof Error ? error.message : "Unknown error",
      details: "Check server logs for more information",
    });
  }
});

module.exports = router;
