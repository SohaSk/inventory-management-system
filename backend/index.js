import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import inventoryRoutes from "./routes/inventory.js";

dotenv.config(); 

const app = express();

app.use(cors());
app.use(express.json());

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

app.use("/inventory", inventoryRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
