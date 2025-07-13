import express from "express";
import { PrismaClient } from "@prisma/client";
import { authenticate, AuthRequest } from "../middleware/auth";

const router = express.Router();
const prisma = new PrismaClient();

// Get all dashboards for the authenticated user
router.get("/", authenticate, async (req: AuthRequest, res) => {
  try {
    const dashboards = await prisma.dashboard.findMany({
      where: { userId: req.userId },
      orderBy: { createdAt: "desc" },
    });

    res.json(dashboards);
  } catch (error) {
    console.error("Error fetching dashboards:", error);
    res.status(500).json({ error: "Failed to fetch dashboards" });
  }
});

// Get a specific dashboard
router.get("/:id", authenticate, async (req: AuthRequest, res) => {
  try {
    const { id } = req.params;

    const dashboard = await prisma.dashboard.findFirst({
      where: {
        id,
        userId: req.userId,
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

// Create a new dashboard
router.post("/", authenticate, async (req: AuthRequest, res) => {
  try {
    const { title, description, sheetId, sheetName } = req.body;

    if (!title || !sheetId) {
      return res.status(400).json({ error: "Title and sheetId are required" });
    }

    const dashboard = await prisma.dashboard.create({
      data: {
        title,
        description,
        sheetId,
        sheetName,
        userId: req.userId!,
      },
    });

    res.status(201).json(dashboard);
  } catch (error) {
    console.error("Error creating dashboard:", error);
    res.status(500).json({ error: "Failed to create dashboard" });
  }
});

// Update a dashboard
router.put("/:id", authenticate, async (req: AuthRequest, res) => {
  try {
    const { id } = req.params;
    const { title, description, sheetId, sheetName } = req.body;

    // Check if dashboard exists and belongs to user
    const existingDashboard = await prisma.dashboard.findFirst({
      where: {
        id,
        userId: req.userId,
      },
    });

    if (!existingDashboard) {
      return res.status(404).json({ error: "Dashboard not found" });
    }

    const dashboard = await prisma.dashboard.update({
      where: { id },
      data: {
        title,
        description,
        sheetId,
        sheetName,
      },
    });

    res.json(dashboard);
  } catch (error) {
    console.error("Error updating dashboard:", error);
    res.status(500).json({ error: "Failed to update dashboard" });
  }
});

// Delete a dashboard
router.delete("/:id", authenticate, async (req: AuthRequest, res) => {
  try {
    const { id } = req.params;

    // Check if dashboard exists and belongs to user
    const existingDashboard = await prisma.dashboard.findFirst({
      where: {
        id,
        userId: req.userId,
      },
    });

    if (!existingDashboard) {
      return res.status(404).json({ error: "Dashboard not found" });
    }

    await prisma.dashboard.delete({
      where: { id },
    });

    res.json({ message: "Dashboard deleted successfully" });
  } catch (error) {
    console.error("Error deleting dashboard:", error);
    res.status(500).json({ error: "Failed to delete dashboard" });
  }
});

export default router;
