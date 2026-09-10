import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { TestSubmission } from '@/types';

export async function POST(req: Request) {
  try {
    const submissionData: TestSubmission = await req.json();
    const saved = db.addSubmission(submissionData);
    return NextResponse.json({ success: true, submission: saved });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Submission failed' }, { status: 500 });
  }
}
