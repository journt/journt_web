"use client";
import { useEffect, useState } from "react";
import Link from "next/link";

type Lead = {
  id: string | number;
  name: string;
  email: string;
  phone?: string;
  city?: string;
  days?: number;
  createdAt?: string;
};

export default function AdminPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/admin/leads")
      .then((res) => res.json())
      .then((data) => {
        setLeads(data);
        setLoading(false);
      })
      .catch(() => {
        setError("Failed to load leads");
        setLoading(false);
      });
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <h1 className="text-3xl font-bold mb-8 text-primary font-poppins">Admin Dashboard</h1>
      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4 text-accent">Leads</h2>
        {loading ? (
          <div>Loading leads...</div>
        ) : error ? (
          <div className="text-red-600">{error}</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white rounded shadow">
              <thead>
                <tr className="bg-accent/20">
                  <th className="py-2 px-4">Name</th>
                  <th className="py-2 px-4">Email</th>
                  <th className="py-2 px-4">Phone</th>
                  <th className="py-2 px-4">City</th>
                  <th className="py-2 px-4">Days</th>
                  <th className="py-2 px-4">Created</th>
                </tr>
              </thead>
              <tbody>
                {leads.map((lead) => (
                  <tr key={lead.id} className="border-b">
                    <td className="py-2 px-4">{lead.name}</td>
                    <td className="py-2 px-4">{lead.email}</td>
                    <td className="py-2 px-4">{lead.phone}</td>
                    <td className="py-2 px-4">{lead.city}</td>
                    <td className="py-2 px-4">{lead.days}</td>
                    <td className="py-2 px-4 text-xs text-gray-500">{lead.createdAt ? new Date(lead.createdAt).toLocaleString() : "-"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4 text-accent">Blog Posts</h2>
        <Link href="/admin/blog" className="inline-block bg-primary text-black font-bold px-4 py-2 rounded shadow hover:bg-primary/90 mb-4">Manage Blog</Link>
      </section>
      <section>
        <h2 className="text-2xl font-semibold mb-4 text-accent">Store</h2>
        <Link href="/admin/store" className="inline-block bg-primary text-black font-bold px-4 py-2 rounded shadow hover:bg-primary/90">Manage Store</Link>
      </section>
    </div>
  );
}
