import mongoose from "mongoose";

const InventorySchema = new mongoose.Schema({
  name: { type: String, required: true },
  sku: { type: String, required: true, unique: true },
  quantity: { type: Number, required: true },
  reorderLevel: { type: Number, required: true },
  lastUpdated: { type: Date, default: Date.now },
  lastSoldDate: { type: Date, default: null } // NEW
});

export default mongoose.model("Inventory", InventorySchema);
