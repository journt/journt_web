import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url);
  const slug = searchParams.get('slug');
  if (!slug) return NextResponse.json({ error: true, message: 'No slug provided' }, { status: 400 });
  const filePath = path.join(process.cwd(), 'src', 'content', 'blog', `${slug}.md`);
  if (!fs.existsSync(filePath)) return NextResponse.json({ error: true, message: 'File not found' }, { status: 404 });
  fs.unlinkSync(filePath);
  return NextResponse.json({ success: true });
}
