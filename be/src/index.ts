import express from "express";
import dotenv from "dotenv";
import { connectDB } from "./model/db";
import authRoutes from "./api/v1/auth";
import contentRoutes from "./api/v1/content";
import brainRoutes from "./api/v1/brain";

dotenv.config();

const app = express();
app.use(express.json());

connectDB();

/* API V1 ROUTES */
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/content", contentRoutes);
app.use("/api/v1/brain", brainRoutes);

app.listen(3000, () => {
  console.log("Server running on port 3000");
});
