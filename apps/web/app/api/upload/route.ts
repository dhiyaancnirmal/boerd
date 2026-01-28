import { NextRequest, NextResponse } from 'next/server';
import { createBlockFromFile } from '@/actions/blocks';

export const runtime = 'nodejs';

/**
 * Handle file uploads via multipart form data
 */
export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File | null;
    const boerdId = formData.get('boerdId') as string | null;

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    // Validate file size (100MB max)
    const MAX_SIZE = 100 * 1024 * 1024;
    if (file.size > MAX_SIZE) {
      return NextResponse.json(
        { error: 'File too large (max 100MB)' },
        { status: 400 }
      );
    }

    const block = await createBlockFromFile(file, boerdId || undefined);

    return NextResponse.json({ block });
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { error: 'Upload failed' },
      { status: 500 }
    );
  }
}
