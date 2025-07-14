import express from "express";
import { GoogleSheetsService } from "../services/googleSheets";

const router = express.Router();

// Test endpoint
router.get("/test", (req, res) => {
  console.log("📊 Test endpoint called");
  try {
    const testData = {
      headers: ["Product", "Sales", "Region"],
      data: [{ Product: "Test Product", Sales: "100", Region: "Test Region" }],
    };
    console.log("✅ Sending test data:", testData);
    res.json(testData);
  } catch (error) {
    console.error("❌ Test endpoint error:", error);
    res.status(500).json({ error: "Test failed" });
  }
});

// Google Sheets endpoint
router.get("/sheet/:sheetId", async (req, res) => {
  console.log("📊 Sheet endpoint called with ID:", req.params.sheetId);

  try {
    const { sheetId } = req.params;
    const { range } = req.query;

    console.log("🔍 Creating GoogleSheetsService...");
    const googleSheetsService = new GoogleSheetsService();

    console.log("🔍 Fetching data...");
    const data = await googleSheetsService.getSheetData(
      sheetId,
      range as string
    );

    console.log("✅ Successfully fetched data:", {
      headers: data.headers.length,
      rows: data.data.length,
    });

    res.json(data);
  } catch (error) {
    console.error("❌ Error in sheet endpoint:", error);
    res.status(500).json({
      error: "Failed to fetch sheet data",
      details: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

export default router;
