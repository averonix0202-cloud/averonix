import express from "express";
const supportRoutes = express.Router();

import authMiddleware from "../middleware/auth.js";
import SupportTicket from "../models/supportticket.js";
import { logActivity } from "../utils/logactivity.js";

// CREATE support ticket
supportRoutes.post("/", authMiddleware, async (req, res) => {
  try {
    const { type, message } = req.body;

    if (!message) {
      return res.status(400).json({ message: "Message is required" });
    }

    const ticket = await SupportTicket.create({
      userId: req.user.id,
      type,
      message,
    });

    // ✅ LOG ACTIVITY
    await logActivity({
      userId: req.user.id,
      action: "SUPPORT_TICKET_CREATED",
      message: `Support request submitted (${type})`,
      metadata: { ticketId: ticket._id },
    });

    res.status(201).json({
      message: "Support request submitted successfully",
      ticket,
    });
  } catch (error) {
    console.error("SUPPORT CREATE ERROR:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// GET user's support tickets
supportRoutes.get("/", authMiddleware, async (req, res) => {
  try {
    const tickets = await SupportTicket.find({
      userId: req.user.id,
    }).sort({ createdAt: -1 });

    res.json(tickets);
  } catch (error) {
    console.error("SUPPORT FETCH ERROR:", error);
    res.status(500).json({ message: "Server error" });
  }
});

export default supportRoutes;

