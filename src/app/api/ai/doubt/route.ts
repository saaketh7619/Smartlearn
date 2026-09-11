import { NextResponse } from 'next/server';
import { POST as handleTutorPost } from '../tutor/route';

export async function POST(req: Request) {
  return handleTutorPost(req);
}
