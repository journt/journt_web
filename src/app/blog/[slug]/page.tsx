import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { notFound } from 'next/navigation';
import Image from 'next/image';

export async function generateStaticParams() {
  const blogDir = path.join(process.cwd(), 'src', 'content', 'blog');
  const files = fs.readdirSync(blogDir);
  return files.map((filename) => ({ slug: filename.replace(/\.md$/, '') }));
}

export default function BlogPostPage({ params }: { params: { slug: string } }) {
  const blogDir = path.join(process.cwd(), 'src', 'content', 'blog');
  const filePath = path.join(blogDir, `${params.slug}.md`);
  if (!fs.existsSync(filePath)) return notFound();
  const fileContent = fs.readFileSync(filePath, 'utf-8');
  const { data, content } = matter(fileContent);
  // Convert markdown content to HTML
  const marked = require('marked');
  const htmlContent = marked.parse(content);
  return (
    <main className="max-w-2xl mx-auto py-12 px-4">
      <h1 className="text-4xl font-bold mb-4">{data.title}</h1>
      {data.image && (
        <div className="mb-6 rounded-lg overflow-hidden aspect-video bg-gray-100">
          <Image src={data.image} alt={data.title} width={600} height={340} className="object-cover w-full h-full" />
        </div>
      )}
      <div className="prose prose-lg" dangerouslySetInnerHTML={{ __html: htmlContent }} />
      <p className="mt-8 text-xs text-gray-400">{typeof data.date === 'string' ? new Date(data.date).toLocaleDateString() : ''}</p>
    </main>
  );
}
