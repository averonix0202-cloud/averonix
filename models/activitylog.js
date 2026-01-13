import mongoose from "mongoose";

const activityLogSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    action: {
      type: String,
      required: true,
      // e.g. "PROJECT_CREATED", "STATUS_UPDATED"
    },

    message: {
      type: String,
      required: true,
    },

    metadata: {
      type: Object, // projectId, oldStatus, newStatus etc.
    },
  },
  { timestamps: true }
);

export default mongoose.model("ActivityLog", activityLogSchema);
