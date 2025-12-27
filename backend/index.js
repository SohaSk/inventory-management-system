import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import inventoryRoutes from "./routes/inventory.js";

const app = express();

app.use(cors());
app.use(express.json());

mongoose.connect("mongodb://127.0.0.1:27017/inventoryDB")
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.log(err));

app.use("/inventory", inventoryRoutes);

app.listen(5000, () => console.log("Server running on port 5000"));
