import { NextResponse } from 'next/server';
import { generateOTP, verifyOTP } from '@/lib/auth';

export async function POST(req: Request) {
  try {
    const { action, identifier, code, name } = await req.json();

    if (action === 'request') {
      const cleanId = (identifier || '').trim();
      const otp = generateOTP(cleanId);
      let emailDispatched = false;
      let emailError: string | null = null;

      const serviceId =
        process.env.EMAILJS_SERVICE_ID ||
        process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID ||
        'service_nk1ngue';
      const templateId =
        process.env.EMAILJS_TEMPLATE_ID ||
        process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID ||
        'template_sptzhpb';
      const publicKey =
        process.env.EMAILJS_PUBLIC_KEY ||
        process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY ||
        'GoD5merb9lhnJGaD5';
      const privateKey =
        process.env.EMAILJS_PRIVATE_KEY ||
        'RfOXAfXWoyR-3jzR3dU31';

      // If identifier is an email address, dispatch OTP via EmailJS
      if (serviceId && templateId && publicKey && cleanId.includes('@')) {
        try {
          const originHeader = req.headers.get('origin') || 'http://localhost:3000';
          const emailResponse = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Origin': originHeader,
              'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) SmartLearn/1.0',
            },
            body: JSON.stringify({
              service_id: serviceId,
              template_id: templateId,
              user_id: publicKey,
              ...(privateKey ? { accessToken: privateKey } : {}),
              template_params: {
                email: cleanId,
                to_email: cleanId,
                user_email: cleanId,
                to: cleanId,
                recipient: cleanId,
                recipient_email: cleanId,
                reply_to: cleanId,
                to_name: name || cleanId.split('@')[0],
                name: name || cleanId.split('@')[0],
                user_name: name || cleanId.split('@')[0],
                from_name: 'SmartLearn Education',
                app_name: 'SmartLearn Education',
                otp_code: otp,
                otp: otp,
                code: otp,
                passcode: otp,
                verification_code: otp,
                user_otp: otp,
                OTP: otp,
                message: `Your SmartLearn verification code is ${otp}. It is valid for 10 minutes. Please enter this code to verify your account.`,
              },
            }),
          });

          if (emailResponse.ok) {
            emailDispatched = true;
          } else {
            const errText = await emailResponse.text();
            emailError = `EmailJS responded with ${emailResponse.status}: ${errText}`;
            console.error('EmailJS Server API error:', errText);
          }
        } catch (err: unknown) {
          emailError = err instanceof Error ? err.message : 'Network error contacting EmailJS';
          console.error('EmailJS Server Dispatch Exception:', err);
        }
      }

      return NextResponse.json({
        success: true,
        message: emailDispatched
          ? `OTP verification email dispatched to ${cleanId} via EmailJS.`
          : `Demo OTP generated for ${cleanId}.`,
        demoCode: otp,
        emailDispatched,
        emailError,
      });
    }

    if (action === 'verify') {
      const cleanId = (identifier || '').trim();
      const cleanCode = (code || '').trim();
      const isValid = verifyOTP(cleanId, cleanCode);
      if (isValid) {
        return NextResponse.json({ success: true, message: 'OTP verified successfully.' });
      } else {
        return NextResponse.json({ success: false, error: 'Invalid or expired OTP code.' }, { status: 400 });
      }
    }

    return NextResponse.json({ success: false, error: 'Invalid action' }, { status: 400 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error?.message || 'Server error' }, { status: 500 });
  }
}
