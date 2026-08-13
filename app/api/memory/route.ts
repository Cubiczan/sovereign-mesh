import { NextResponse } from 'next/server';
import { memoryBank } from '@/lib/memory-bank';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const query = searchParams.get('q');
  const category = searchParams.get('category');

  if (query) {
    return NextResponse.json({ entities: memoryBank.search(query) });
  }

  if (category) {
    return NextResponse.json({
      entities: memoryBank.getByCategory(category as unknown as Parameters<typeof memoryBank.getByCategory>[0]),
    });
  }

  return NextResponse.json({
    entities: memoryBank.getAll(),
    totalCount: memoryBank.getAll().length,
    lastSynchronizedAt: new Date().toISOString(),
  });
}
