

import { NextResponse } from 'next/server';
import { createResource } from '@/lib/actions/resources';

export async function POST(request: Request) {
  try {
    const { text } = await request.json();

    if (!text) {
      return NextResponse.json({ error: 'Text is required' }, { status: 400 });
    }

    await createResource({content: text})

    return NextResponse.json({ message: 'Embeddings saved successfully' }, { status: 200 });
  } catch (error) {
    console.error('Error saving embeddings:', error);
    return NextResponse.json({ error: 'Failed to save embeddings' }, { status: 500 });
  }
}