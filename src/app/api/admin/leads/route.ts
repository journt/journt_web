// This API route is disabled for Vercel deployment (SQLite/Prisma not supported in serverless).
import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json([]);
}
