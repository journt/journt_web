"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function NewProduct() {
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    const res = await fetch("/api/admin/store", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, price }),
    });
    if (res.ok) {
      router.push("/admin/store");
    } else {
      setError("Failed to save product");
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <h1 className="text-3xl font-bold mb-8 text-primary font-poppins">Add Product</h1>
      <form onSubmit={handleSubmit} className="bg-white rounded shadow p-6 max-w-xl mx-auto flex flex-col gap-4">
        <input
          type="text"
          placeholder="Product Name"
          className="px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary text-base"
          value={name}
          onChange={e => setName(e.target.value)}
          required
        />
        <input
          type="number"
          placeholder="Price"
          className="px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary text-base"
          value={price}
          onChange={e => setPrice(e.target.value)}
          required
        />
        {error && <div className="text-red-600 text-sm mb-2">{error}</div>}
        <button
          type="submit"
          className="bg-primary text-black font-bold px-6 py-3 rounded-lg shadow hover:bg-primary/90 transition"
          disabled={saving}
        >
          {saving ? "Saving..." : "Save Product"}
        </button>
      </form>
    </div>
  );
}
