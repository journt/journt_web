import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function POST(request: Request) {
  const { title, content, image } = await request.json();
  if (!title || !content) {
    return NextResponse.json({ error: true, message: 'Title and content required.' }, { status: 400 });
  }
  const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  const filePath = path.join(process.cwd(), 'src', 'content', 'blog', `${slug}.md`);
  const md = `---\ntitle: ${title}\ndate: ${new Date().toISOString()}\n${image ? `image: ${image}\n` : ''}---\n\n${content}\n`;
  fs.writeFileSync(filePath, md, 'utf8');
  return NextResponse.json({ success: true, slug });
}
