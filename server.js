import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import router from "./routes/projectroutes.js";
import activityRoutes from "./routes/activityroute.js";
import supportRoutes from "./routes/supportroutes.js";
import adminRoutes from "./routes/admin.routes.js";

dotenv.config();

import authRoutes from "./routes/authroutes.js";

const app = express();
app.use(
  cors({
    origin: [
      "https://averonix.in",
      "https://www.averonix.in"
    ],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"]
  })
);



app.use(express.json());

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log(err));

app.use("/api/auth", authRoutes);
app.use("/api/projects", router);
app.use("/api/activity-logs", activityRoutes);
app.use("/api/support", supportRoutes);
app.use("/api/admin", adminRoutes);

app.listen(5000, () => console.log("Server running on port 5000"));




