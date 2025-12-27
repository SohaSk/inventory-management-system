import express from "express";
import Inventory from "../models/Inventory.js";

const router = express.Router();

// GET all items
router.get("/", async (req, res) => {
  const items = await Inventory.find();
  res.json(items);
});

// ADD item
router.post("/", async (req, res) => {
  const item = new Inventory({
    ...req.body,
    lastUpdated: new Date(),
    lastSoldDate: null // default when adding new stock
  });
  await item.save();
  res.json(item);
});

// UPDATE item (edit stock or mark sold quantity)
router.put("/:id", async (req, res) => {
  const { quantitySold = 0, quantity: newQuantity, ...rest } = req.body;

  const currentItem = await Inventory.findById(req.params.id);
  if (!currentItem) return res.status(404).json({ message: "Item not found" });

  const updateData = { ...rest, lastUpdated: new Date() };

  if (quantitySold > 0) {
    updateData.lastSoldDate = new Date();
    updateData.quantity = currentItem.quantity - quantitySold;
  } else {
    updateData.quantity = newQuantity;
  }

  const item = await Inventory.findByIdAndUpdate(req.params.id, updateData, { new: true });
  res.json(item);
});




// DELETE item
router.delete("/:id", async (req, res) => {
  await Inventory.findByIdAndDelete(req.params.id);
  res.json({ message: "Deleted" });
});

export default router;
