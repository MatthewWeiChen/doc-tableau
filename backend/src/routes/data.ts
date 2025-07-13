import express from "express";
import { GoogleSheetsService } from "../services/googleSheets";
import { authenticate } from "../middleware/auth";

const router = express.Router();
const googleSheetsService = new GoogleSheetsService();

router.get("/sheet/:sheetId", authenticate, async (req, res) => {
  try {
    const { sheetId } = req.params;
    const { range } = req.query;

    const data = await googleSheetsService.getSheetData(
      sheetId,
      range as string
    );

    res.json(data);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch sheet data" });
  }
});

router.get("/sheet-info/:sheetId", authenticate, async (req, res) => {
  try {
    const { sheetId } = req.params;

    const info = await googleSheetsService.getSheetInfo(sheetId);

    res.json(info);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch sheet info" });
  }
});

export default router;
