"use client";
import { useState, useEffect } from "react";
import Link from "next/link";

type Product = {
  id: string | number;
  name: string;
  price: number;
};

export default function AdminStore() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/store")
      .then((res) => res.json())
      .then((data) => {
        setProducts(data);
        setLoading(false);
      });
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <h1 className="text-3xl font-bold mb-8 text-primary font-poppins">Manage Store</h1>
      <Link href="/admin/store/new" className="bg-accent text-black font-bold px-4 py-2 rounded shadow hover:bg-accent/90 mb-6 inline-block">Add Product</Link>
      {loading ? (
        <div>Loading...</div>
      ) : (
        <ul className="mt-6 space-y-4">
          {products.map((product) => (
            <li key={product.id} className="bg-white rounded shadow p-4 flex justify-between items-center">
              <span className="font-semibold text-lg">{product.name}</span>
              <span className="text-gray-700">${product.price}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
