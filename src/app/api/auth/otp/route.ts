import { NextResponse } from 'next/server';
import { generateOTP, verifyOTP } from '@/lib/auth';

export async function POST(req: Request) {
  try {
    const { action, identifier, code } = await req.json();

    if (action === 'request') {
      const otp = generateOTP(identifier);
      return NextResponse.json({ success: true, message: 'OTP dispatched', demoCode: otp });
    }

    if (action === 'verify') {
      const isValid = verifyOTP(identifier, code);
      if (isValid) {
        return NextResponse.json({ success: true, message: 'OTP verified' });
      } else {
        return NextResponse.json({ success: false, error: 'Invalid or expired OTP' }, { status: 400 });
      }
    }

    return NextResponse.json({ success: false, error: 'Invalid action' }, { status: 400 });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Server error' }, { status: 500 });
  }
}
