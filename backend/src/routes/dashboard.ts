import express from "express";
import { PrismaClient } from "@prisma/client";
import { authenticate, AuthRequest } from "../middleware/auth";

const router = express.Router();
const prisma = new PrismaClient();

// Get all user's dashboards
router.get("/", authenticate, async (req, res) => {
  try {
    const authReq = req as AuthRequest;
    console.log(`📊 Fetching dashboards for user: ${authReq.user?.email}`);

    const dashboards = await prisma.dashboard.findMany({
      where: { userId: authReq.userId },
      orderBy: { updatedAt: "desc" },
    });

    console.log(`✅ Found ${dashboards.length} dashboards`);
    res.json(dashboards);
  } catch (error) {
    console.error("Error fetching dashboards:", error);
    res.status(500).json({ error: "Failed to fetch dashboards" });
  }
});

// Get specific dashboard
router.get("/:id", authenticate, async (req, res) => {
  try {
    const authReq = req as AuthRequest;
    const { id } = req.params;

    const dashboard = await prisma.dashboard.findFirst({
      where: {
        id,
        userId: authReq.userId,
      },
    });

    if (!dashboard) {
      return res.status(404).json({ error: "Dashboard not found" });
    }

    res.json(dashboard);
  } catch (error) {
    console.error("Error fetching dashboard:", error);
    res.status(500).json({ error: "Failed to fetch dashboard" });
  }
});

// Create new dashboard
router.post("/", authenticate, async (req, res) => {
  try {
    const authReq = req as AuthRequest;
    const { title, description, sheetId, sheetName } = req.body;

    console.log(
      `📊 Creating dashboard '${title}' for user: ${authReq.user?.email}`
    );

    if (!title || !sheetId) {
      return res.status(400).json({ error: "Title and sheetId are required" });
    }

    const dashboard = await prisma.dashboard.create({
      data: {
        title,
        description: description || "",
        sheetId,
        sheetName: sheetName || "",
        userId: authReq.userId!,
      },
    });

    console.log("✅ Dashboard created:", dashboard.id);
    res.status(201).json(dashboard);
  } catch (error) {
    console.error("Error creating dashboard:", error);
    res.status(500).json({ error: "Failed to create dashboard" });
  }
});

// Update dashboard
router.put("/:id", authenticate, async (req, res) => {
  try {
    const authReq = req as AuthRequest;
    const { id } = req.params;
    const { title, description, sheetId, sheetName } = req.body;

    // Check if dashboard exists and belongs to user
    const existingDashboard = await prisma.dashboard.findFirst({
      where: {
        id,
        userId: authReq.userId,
      },
    });

    if (!existingDashboard) {
      return res.status(404).json({ error: "Dashboard not found" });
    }

    const dashboard = await prisma.dashboard.update({
      where: { id },
      data: {
        title: title || existingDashboard.title,
        description:
          description !== undefined
            ? description
            : existingDashboard.description,
        sheetId: sheetId || existingDashboard.sheetId,
        sheetName:
          sheetName !== undefined ? sheetName : existingDashboard.sheetName,
        updatedAt: new Date(),
      },
    });

    console.log("✅ Dashboard updated:", dashboard.id);
    res.json(dashboard);
  } catch (error) {
    console.error("Error updating dashboard:", error);
    res.status(500).json({ error: "Failed to update dashboard" });
  }
});

// Delete dashboard
router.delete("/:id", authenticate, async (req, res) => {
  try {
    const authReq = req as AuthRequest;
    const { id } = req.params;

    // Check if dashboard exists and belongs to user
    const existingDashboard = await prisma.dashboard.findFirst({
      where: {
        id,
        userId: authReq.userId,
      },
    });

    if (!existingDashboard) {
      return res.status(404).json({ error: "Dashboard not found" });
    }

    await prisma.dashboard.delete({
      where: { id },
    });

    console.log("✅ Dashboard deleted:", id);
    res.json({ message: "Dashboard deleted successfully" });
  } catch (error) {
    console.error("Error deleting dashboard:", error);
    res.status(500).json({ error: "Failed to delete dashboard" });
  }
});

export default router;
