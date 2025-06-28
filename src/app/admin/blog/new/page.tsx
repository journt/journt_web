"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function NewBlogPost() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [image, setImage] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImageFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    let imageUrl = image;
    if (imageFile) {
      const formData = new FormData();
      formData.append("file", imageFile);
      const uploadRes = await fetch("/api/admin/blog/upload", {
        method: "POST",
        body: formData,
      });
      const uploadData = await uploadRes.json();
      if (uploadData.url) {
        imageUrl = uploadData.url;
      } else {
        setError("Image upload failed");
        setSaving(false);
        return;
      }
    }
    const res = await fetch("/api/admin/blog/new", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, content, image: imageUrl }),
    });
    if (res.ok) {
      router.push("/admin/blog");
    } else {
      setError("Failed to save post");
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <h1 className="text-3xl font-bold mb-8 text-primary font-poppins">New Blog Post</h1>
      <form onSubmit={handleSubmit} className="bg-white rounded shadow p-6 max-w-xl mx-auto flex flex-col gap-4">
        <input
          type="text"
          placeholder="Title (max 30 chars)"
          className="px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary text-base"
          value={title}
          onChange={e => {
            if (e.target.value.length <= 30) setTitle(e.target.value);
          }}
          required
        />
        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
        />
        <input
          type="text"
          placeholder="Image URL (optional)"
          className="px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary text-base"
          value={image}
          onChange={e => setImage(e.target.value)}
        />
        <textarea
          placeholder="Content (Markdown supported)"
          className="px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary text-base min-h-[200px]"
          value={content}
          onChange={e => setContent(e.target.value)}
          required
        />
        {error && <div className="text-red-600 text-sm mb-2">{error}</div>}
        <button
          type="submit"
          className="bg-primary text-black font-bold px-6 py-3 rounded-lg shadow hover:bg-primary/90 transition"
          disabled={saving}
        >
          {saving ? "Saving..." : "Save Post"}
        </button>
      </form>
    </div>
  );
}
