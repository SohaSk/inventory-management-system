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

  // Dead stock: 90 days
  const isDeadStock = (lastSoldDate) => {
    if (!lastSoldDate) return false;
    return Date.now() - new Date(lastSoldDate).getTime() > 90 * 24 * 60 * 60 * 1000;
  };

  // Recently sold: 7 days
  const isRecentlySold = (lastSoldDate) => {
    if (!lastSoldDate) return false;
    return Date.now() - new Date(lastSoldDate).getTime() <= 7 * 24 * 60 * 60 * 1000;
  };

  // Submit
  const submit = async () => {
    let finalQuantity = Number(form.quantity);

    // If editing & selling stock
    if (editId && form.quantitySold) {
      finalQuantity = finalQuantity - Number(form.quantitySold);
      if (finalQuantity < 0) {
        alert("Quantity sold cannot exceed available stock");
        return;
      }
    }

    const payload = {
      name: form.name,
      sku: form.sku,
      quantity: finalQuantity,
      reorderLevel: Number(form.reorderLevel),
    };

    const url = editId
      ? `${API_BASE}/inventory/${editId}`
      : `${API_BASE}/inventory`;

    await fetch(url, {
      method: editId ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    setForm({ name: "", sku: "", quantity: "", reorderLevel: "", quantitySold: "" });
    setEditId(null);
    location.reload();
  };

  const del = async (id) => {
    await fetch(`${API_BASE}/inventory/${id}`, { method: "DELETE" });
    location.reload();
  };

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
    <div style={{ padding: 40, fontFamily: "Arial", maxWidth: 1000, margin: "auto" }}>
      <h1 style={{ textAlign: "center" }}>Inventory Management</h1>

      {/* Form */}
      <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 20 }}>
        <input placeholder="Name" value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })} />

        <input placeholder="SKU" value={form.sku}
          onChange={(e) => setForm({ ...form, sku: e.target.value })} />

        <input type="number" placeholder="Quantity" value={form.quantity}
          onChange={(e) => setForm({ ...form, quantity: e.target.value })} />

        <input type="number" placeholder="Reorder Level" value={form.reorderLevel}
          onChange={(e) => setForm({ ...form, reorderLevel: e.target.value })} />

        {editId && (
          <input
            type="number"
            placeholder="Quantity Sold"
            value={form.quantitySold}
            onChange={(e) => setForm({ ...form, quantitySold: e.target.value })}
          />
        )}

        <button onClick={submit}>
          {editId ? "Update" : "Add"}
        </button>
      </div>

      {/* Table */}
      <table border="1" cellPadding="10" width="100%">
        <thead>
          <tr>
            <th>SKU</th>
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

            let status = "Healthy";
            if (deadStock) status = "Dead Stock";
            else if (lowStock) status = "Low Stock";
            else if (recentlySold) status = "Recently Sold";

            return (
              <tr key={i._id}>
                <td>{i.sku}</td>
                <td>{i.name}</td>
                <td>{i.quantity}</td>
                <td>{i.reorderLevel}</td>
                <td>{status}</td>
                <td>
                  {i.lastSoldDate
                    ? new Date(i.lastSoldDate).toISOString().split("T")[0]
                    : "-"}
                </td>
                <td>
                  <button onClick={() => edit(i)}>Edit</button>
                  <button onClick={() => del(i._id)}>Delete</button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export async function getServerSideProps() {
  const res = await fetch(`${API_BASE}/inventory`);
  const items = await res.json();
  return { props: { items } };
}
