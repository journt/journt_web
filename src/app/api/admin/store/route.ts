import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET() {
  const storeDir = path.join(process.cwd(), 'src', 'content', 'store');
  if (!fs.existsSync(storeDir)) return NextResponse.json([]);
  const files = fs.readdirSync(storeDir);
  const products = files.filter(f => f.endsWith('.json')).map(filename => {
    const filePath = path.join(storeDir, filename);
    const fileContent = fs.readFileSync(filePath, 'utf8');
    const data = JSON.parse(fileContent);
    return { id: filename.replace(/\.json$/, ''), ...data };
  });
  return NextResponse.json(products);
}
