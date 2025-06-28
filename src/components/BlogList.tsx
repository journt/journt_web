import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import Link from 'next/link';
import Image from 'next/image';

const BLOG_DIR = path.join(process.cwd(), 'src', 'content', 'blog');

function getPosts() {
  const files = fs.readdirSync(BLOG_DIR);
  return files.map((filename) => {
    const filePath = path.join(BLOG_DIR, filename);
    const fileContent = fs.readFileSync(filePath, 'utf-8');
    const { data, content } = matter(fileContent);
    return {
      slug: filename.replace(/\.md$/, ''),
      date: data.date ? String(data.date) : undefined,
      title: data.title,
      image: data.image,
      excerpt: data.excerpt || content.slice(0, 120) + '...'
    };
  });
}

export default function BlogList() {
  const posts = getPosts();
  return (
    <div className="grid md:grid-cols-2 gap-8">
      {posts.map((post) => (
        <Link key={post.slug} href={`/blog/${post.slug}`} className="block rounded-xl shadow-lg bg-white hover:shadow-xl transition p-6">
          {post.image && (
            <div className="mb-4 rounded-lg overflow-hidden aspect-video bg-gray-100">
              <Image src={post.image} alt={post.title} width={600} height={340} className="object-cover w-full h-full" />
            </div>
          )}
          <h2 className="text-2xl font-semibold mb-2">{post.title}</h2>
          <p className="text-gray-600 mb-2">{post.excerpt}</p>
          <span className="text-xs text-gray-400">{typeof post.date === 'string' ? new Date(post.date).toLocaleDateString() : ''}</span>
        </Link>
      ))}
    </div>
  );
}
