// routes/admin.routes.js
import express from "express";
import Project from "../models/project.js";
import User from "../models/User.js";
import SupportTicket from "../models/SupportTicket.js";

const router = express.Router();

router.get("/projects", async (req, res) => {
  const projects = await Project.find().populate("clientId", "name email");

  res.json(projects);
});

// admin.routes.js
router.put("/projects/:id/activate", async (req, res) => {
  try {
    const { developer } = req.body;

    if (!developer) {
      return res.status(400).json({ message: "Developer name required" });
    }

    const project = await Project.findByIdAndUpdate(
      req.params.id,
      {
        developer,
        status: "active",
      },
      { new: true }
    );

    res.json(project);
  } catch (err) {
    res.status(500).json({ message: "Project update failed" });
  }
});
router.get("/users", async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch users" });
  }
});
router.put("/projects/:id/complete", async (req, res) => {
  try {
    const project = await Project.findByIdAndUpdate(
      req.params.id,
      { status: "completed" },
      { new: true }
    );

    res.json(project);
  } catch (err) {
    res.status(500).json({ message: "Failed to complete project" });
  }
});

router.delete("/projects/:id", async (req, res) => {
  try {
    await Project.findByIdAndDelete(req.params.id);
    res.json({ message: "Project deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Failed to delete project" });
  }
});

// Get projects of a specific user
router.get("/users/:id/projects", async (req, res) => {
  try {
    const projects = await Project.find({
      clientId: req.params.id,
    });

    res.json(projects);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch user projects" });
  }
});

// Get developers with project stats
router.get("/developers", async (req, res) => {
  try {
    const projects = await Project.find({ developer: { $ne: null } });

    const devMap = {};

    projects.forEach((p) => {
      if (!devMap[p.developer]) {
        devMap[p.developer] = {
          name: p.developer,
          total: 0,
          active: 0,
          completed: 0,
        };
      }

      devMap[p.developer].total += 1;
      if (p.status === "active") devMap[p.developer].active += 1;
      if (p.status === "completed") devMap[p.developer].completed += 1;
    });

    res.json(Object.values(devMap));
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch developers" });
  }
});
// Get projects assigned to a developer
router.get("/developers/:name/projects", async (req, res) => {
  try {
    const projects = await Project.find({
      developer: req.params.name,
    });

    res.json(projects);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch developer projects" });
  }
});
router.get("/support-tickets", async (req, res) => {
  try {
    const tickets = await SupportTicket.find()
      .populate("userId", "name email")
      .sort({ createdAt: -1 });

    res.status(200).json(tickets);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch tickets" });
  }
});

export default router;
