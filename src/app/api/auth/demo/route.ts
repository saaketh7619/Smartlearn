import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { createSessionToken } from '@/lib/auth';
import { Role } from '@/types';

export async function POST(req: Request) {
  try {
    const { role } = await req.json();
    const users = db.getUsersByRole((role || 'STUDENT') as Role);
    const user = users[0] || db.users[0];
    const token = createSessionToken(user);

    return NextResponse.json({
      success: true,
      user,
      token,
      redirectUrl: `/${user.role.toLowerCase()}`,
    });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Demo login error' }, { status: 500 });
  }
}
