import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function POST(request: Request) {
  const { name, price } = await request.json();
  if (!name || !price) {
    return NextResponse.json({ error: true, message: 'Name and price required.' }, { status: 400 });
  }
  const id = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  const filePath = path.join(process.cwd(), 'src', 'content', 'store', `${id}.json`);
  const data = { name, price };
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
  return NextResponse.json({ success: true, id });
}
