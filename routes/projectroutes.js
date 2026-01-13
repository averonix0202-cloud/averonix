import express from "express";
const router = express.Router();
import authMiddleware from "../middleware/auth.js";
import Project from "../models/project.js";
import { logActivity } from "../utils/logactivity.js";

// GET all projects for client
router.get("/client", authMiddleware, async (req, res) => {
  try {
    const projects = await Project.find({
      clientId: req.user.id,
    }).sort({ createdAt: -1 });

    res.json(projects);
  } catch (error) {
    console.error("PROJECT FETCH ERROR:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// GET project count
router.get("/client/count", authMiddleware, async (req, res) => {
  try {
    const count = await Project.countDocuments({
      clientId: req.user.id,
    });

    res.json({ count });
  } catch (error) {
    console.error("PROJECT COUNT ERROR:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// GET active projects
router.get("/client/active", authMiddleware, async (req, res) => {
  const projects = await Project.find({
    clientId: req.user.id,
    status: "active",
  });

  res.json(projects);
});

// GET pending projects
router.get("/client/pending", authMiddleware, async (req, res) => {
  const projects = await Project.find({
    clientId: req.user.id,
    status: "pending",
  });

  res.json(projects);
});

// GET completed projects
router.get("/client/completed", authMiddleware, async (req, res) => {
  const projects = await Project.find({
    clientId: req.user.id,
    status: "completed",
  });

  res.json(projects);
});

router.post("/", authMiddleware, async (req, res) => {
  try {
    const { title, description, deadline, budgetRange, projectType, features } =
      req.body;

    // 🔐 Basic validation
    if (!title || !description || !deadline || !budgetRange) {
      return res.status(400).json({
        message: "Title, description, deadline, and budget are required",
      });
    }

    const project = new Project({
      clientId: req.user.id, // from JWT
      title,
      description,
      deadline,
      budgetRange,
      projectType,
      features,
      status: "pending", // default
    });

    await project.save();

    // ✅ LOG ACTIVITY
    await logActivity({
      userId: req.user.id,
      action: "PROJECT_CREATED",
      message: `Project "${project.title}" was created`,
      metadata: {
        projectId: project._id,
        status: "pending",
      },
    });

    res.status(201).json({
      message: "Project submitted successfully",
      project,
    });
  } catch (error) {
    console.error("CREATE PROJECT ERROR:", error);
    res.status(500).json({
      message: "Server error while creating project",
    });
  }
});

export default router;

