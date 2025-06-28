"use client";
import { useState, useEffect } from "react";
import Link from "next/link";

export default function AdminBlog() {
  const [posts, setPosts] = useState<Array<{slug: string, title: string, date?: string}>>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/blog")
      .then((res) => res.json())
      .then((data) => {
        setPosts(data);
        setLoading(false);
      });
  }, [posts.length]);

  const handleDelete = async (slug: string) => {
    if (!confirm("Are you sure you want to delete this post?")) return;
    await fetch(`/api/admin/blog/delete?slug=${slug}`, { method: "DELETE" });
    setPosts(posts.filter((p) => p.slug !== slug));
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <h1 className="text-3xl font-bold mb-8 text-primary font-poppins">Manage Blog Posts</h1>
      <Link href="/admin/blog/new" className="bg-accent text-black font-bold px-4 py-2 rounded shadow hover:bg-accent/90 mb-6 inline-block">New Post</Link>
      {loading ? (
        <div>Loading...</div>
      ) : (
        <ul className="mt-6 space-y-4">
          {posts.map((post) => (
            <li key={post.slug} className="bg-white rounded shadow p-4 flex justify-between items-center">
              <span className="font-semibold text-lg">{post.title}</span>
              {post.date && (
                <span className="text-gray-500 text-xs ml-2">{typeof post.date === 'string' ? new Date(post.date).toLocaleDateString() : ''}</span>
              )}
              <div className="flex gap-2 ml-4">
                <Link href={`/blog/${post.slug}`} className="text-blue-600 underline">View</Link>
                <button onClick={() => handleDelete(post.slug)} className="text-red-600 underline">Delete</button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
