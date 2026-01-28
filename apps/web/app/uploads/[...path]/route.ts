import { NextRequest, NextResponse } from 'next/server';
import { join } from 'path';
import { existsSync } from 'fs';

const DATA_DIR = process.env.DATA_DIR || join(process.cwd(), '..', '..', 'data');
const UPLOADS_DIR = join(DATA_DIR, 'uploads');

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ path: string[] }> }
) {
  const { path } = await context.params;
  const filePath = join(UPLOADS_DIR, ...path);

  // Security: ensure path is within uploads directory
  if (!filePath.startsWith(UPLOADS_DIR)) {
    return new NextResponse('Forbidden', { status: 403 });
  }

  if (!existsSync(filePath)) {
    return new NextResponse('Not Found', { status: 404 });
  }

  const file = Bun.file(filePath);
  const buffer = await file.arrayBuffer();

  return new NextResponse(buffer, {
    headers: {
      'Content-Type': file.type || 'application/octet-stream',
      'Cache-Control': 'public, max-age=31536000, immutable',
    },
  });
}
