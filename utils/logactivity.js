import ActivityLog from "../models/activitylog.js";

export const logActivity = async ({
  userId,
  action,
  message,
  metadata = {},
}) => {
  try {
    await ActivityLog.create({
      userId,
      action,
      message,
      metadata,
    });
  } catch (err) {
    console.error("Activity log failed:", err.message);
  }
};

