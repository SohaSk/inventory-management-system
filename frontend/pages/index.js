import { useState } from "react";

const API_BASE = "https://inventory-management-system-fuiw.onrender.com";

export default function Home({ items }) {
  const [form, setForm] = useState({
    name: "",
    sku: "",
    quantity: "",
    reorderLevel: "",
    quantitySold: "",
  });
  const [editId, setEditId] = useState(null);

  // Dead stock logic: 90 days since lastSoldDate
  const isDeadStock = (lastSoldDate) => {
    if (!lastSoldDate) return false;
    const DAYS_90 = 90 * 24 * 60 * 60 * 1000;
    return Date.now() - new Date(lastSoldDate).getTime() > DAYS_90;
  };

  // Recently sold: last 7 days
  const isRecentlySold = (lastSoldDate) => {
    if (!lastSoldDate) return false;
    const DAYS_7 = 7 * 24 * 60 * 60 * 1000;
    return Date.now() - new Date(lastSoldDate).getTime() <= DAYS_7;
  };

  // Submit form
  const submit = async () => {
    const url = editId
      ? `${API_BASE}/inventory/${editId}`
      : `${API_BASE}/inventory`;
    const method = editId ? "PUT" : "POST";

    const payload = {
      ...form,
      quantity: Number(form.quantity),
      reorderLevel: Number(form.reorderLevel),
      quantitySold: Number(form.quantitySold) || 0,
    };

    await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    setForm({ name: "", sku: "", quantity: "", reorderLevel: "", quantitySold: "" });
    setEditId(null);
    location.reload();
  };

  // Delete item
  const del = async (id) => {
    await fetch(`${API_BASE}/inventory/${id}`, { method: "DELETE" });
    location.reload();
  };

  // Edit item
  const edit = (i) => {
    setEditId(i._id);
    setForm({
      name: i.name,
      sku: i.sku,
      quantity: i.quantity,
      reorderLevel: i.reorderLevel,
      quantitySold: "",
    });
  };

  return (
    <div style={{ padding: 40, fontFamily: "Arial, sans-serif", maxWidth: 1000, margin: "auto" }}>
      <h1 style={{ textAlign: "center", color: "#2c3e50" }}>Inventory Management</h1>

      {/* Form */}
      <div style={{ display: "flex", gap: 10, marginBottom: 20, flexWrap: "wrap" }}>
        <input
          placeholder="Name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          style={{ flex: 1, padding: 8, borderRadius: 5, border: "1px solid #ccc" }}
        />
        <input
          placeholder="SKU"
          value={form.sku}
          onChange={(e) => setForm({ ...form, sku: e.target.value })}
          style={{ flex: 1, padding: 8, borderRadius: 5, border: "1px solid #ccc" }}
        />
        <input
          type="number"
          placeholder="Qty"
          value={form.quantity}
          onChange={(e) => setForm({ ...form, quantity: e.target.value })}
          style={{ flex: 1, padding: 8, borderRadius: 5, border: "1px solid #ccc" }}
        />
        <input
          type="number"
          placeholder="Reorder Level"
          value={form.reorderLevel}
          onChange={(e) => setForm({ ...form, reorderLevel: e.target.value })}
          style={{ flex: 1, padding: 8, borderRadius: 5, border: "1px solid #ccc" }}
        />

        {/* Quantity Sold input only shown when editing */}
        {editId && (
          <input
            type="number"
            placeholder="Quantity Sold"
            value={form.quantitySold}
            onChange={(e) => setForm({ ...form, quantitySold: e.target.value })}
            style={{ flex: 1, padding: 8, borderRadius: 5, border: "1px solid #ccc" }}
          />
        )}

        <button
          onClick={submit}
          style={{
            padding: "8px 16px",
            borderRadius: 5,
            border: "none",
            backgroundColor: "#3498db",
            color: "white",
            cursor: "pointer",
          }}
        >
          {editId ? "Update" : "Add"}
        </button>
      </div>

      {/* Inventory Table */}
      <table
        style={{
          width: "100%",
          borderCollapse: "collapse",
          textAlign: "left",
          boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
        }}
      >
        <thead>
          <tr style={{ backgroundColor: "#2c3e50", color: "white" }}>
            <th style={{ padding: 10 }}>SKU</th>
            <th>Name</th>
            <th>Qty</th>
            <th>Reorder</th>
            <th>Status</th>
            <th>Last Sold</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {items.map((i) => {
            const lowStock = i.quantity < i.reorderLevel;
            const deadStock = isDeadStock(i.lastSoldDate);
            const recentlySold = isRecentlySold(i.lastSoldDate);

            let bg = "#d6ffd6"; // healthy
            let status = "Healthy";

            if (deadStock) {
              bg = "#e0e0e0";
              status = "Dead Stock";
            } else if (lowStock) {
              bg = "#ffd6d6";
              status = "Low Stock";
            } else if (recentlySold) {
              bg = "#ffe8b3"; // light yellow for recent sale
              status = "Recently Sold";
            }

            return (
              <tr key={i._id} style={{ background: bg, transition: "background 0.3s", cursor: "default" }}>
                <td style={{ padding: 8 }}>{i.sku}</td>
                <td>{i.name}</td>
                <td>{i.quantity}</td>
                <td>{i.reorderLevel}</td>
                <td>{status}</td>
                <td>{i.lastSoldDate ? new Date(i.lastSoldDate).toISOString().split("T")[0] : "-"}</td>
                <td>
                  <button
                    onClick={() => edit(i)}
                    style={{
                      marginRight: 5,
                      padding: "4px 8px",
                      borderRadius: 3,
                      border: "none",
                      backgroundColor: "#f39c12",
                      color: "white",
                      cursor: "pointer",
                    }}
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => del(i._id)}
                    style={{
                      padding: "4px 8px",
                      borderRadius: 3,
                      border: "none",
                      backgroundColor: "#e74c3c",
                      color: "white",
                      cursor: "pointer",
                    }}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

// Fetch data from backend
export async function getServerSideProps() {
  const res = await fetch(`${API_BASE}/inventory`);
  const items = await res.json();
  return { props: { items } };
}
