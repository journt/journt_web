import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const { name, email, phone, city, days } = await request.json();
    if (!name || !email || !phone || !city || !days) {
      return NextResponse.json({ error: true, message: 'All fields are required.' }, { status: 400 });
    }
    // Save lead to database
    const lead = await prisma.lead.create({
      data: { name, email, phone, city, days: Number(days) },
    });
    return NextResponse.json({ success: true, lead });
  } catch {
    return NextResponse.json({ error: true, message: 'Failed to save lead.' }, { status: 500 });
  }
}
