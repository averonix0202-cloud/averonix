import mongoose from "mongoose";

const projectSchema = new mongoose.Schema(
  {
    clientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    title: {
      type: String,
      required: true,
    },

    description: {
      type: String,
      required: true,
    },

    deadline: {
      type: Date,
      required: true,
    },

    budgetRange: {
      type: String,
      required: true,
    },

    projectType: {
      type: String,
      enum: ["website", "app", "uiux", "aiml", "marketing", "other"],
      default: "website",
    },

    features: {
      type: [String],
      default: [],
    },

    status: {
      type: String,
      enum: ["pending", "active", "completed"],
      default: "pending",
    },
    developer: {
      type: String,
      default: null,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Project", projectSchema);
