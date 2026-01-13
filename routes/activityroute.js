import express from "express";
const activityRouter = express.Router();

import authMiddleware from "../middleware/auth.js";
import ActivityLog from "../models/activitylog.js";

// GET user's activity logs
activityRouter.get("/", authMiddleware, async (req, res) => {
  try {
    const logs = await ActivityLog.find({
      userId: req.user.id,
    })
      .sort({ createdAt: -1 })
      .limit(50);

    res.json(logs);
  } catch (error) {
    console.error("FETCH ACTIVITY LOGS ERROR:", error);
    res.status(500).json({ message: "Server error" });
  }
});

export default activityRouter;

