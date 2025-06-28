import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

export async function GET() {
  const blogDir = path.join(process.cwd(), 'src', 'content', 'blog');
  const files = fs.readdirSync(blogDir);
  const posts = files.filter(f => f.endsWith('.md')).map(filename => {
    const filePath = path.join(blogDir, filename);
    const fileContent = fs.readFileSync(filePath, 'utf8');
    const { data } = matter(fileContent);
    return {
      slug: filename.replace(/\.md$/, ''),
      title: data.title || filename.replace(/\.md$/, ''),
      ...data,
    };
  });
  return NextResponse.json(posts);
}
