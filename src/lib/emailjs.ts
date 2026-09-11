import emailjs from '@emailjs/browser';

export interface EmailJSConfig {
  serviceId: string;
  templateId: string;
  publicKey: string;
}

const STORAGE_KEY = 'smartlearn_emailjs_config';

const DEFAULT_SERVICE_ID = 'service_nk1ngue';
const DEFAULT_TEMPLATE_ID = 'template_sptzhpb';
const DEFAULT_PUBLIC_KEY = 'GoD5merb9lhnJGaD5';

/**
 * Retrieve EmailJS configuration with robust fallback to verified credentials
 */
export function getEmailJsConfig(): EmailJSConfig {
  let serviceId = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID || DEFAULT_SERVICE_ID;
  let templateId = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID || DEFAULT_TEMPLATE_ID;
  let publicKey = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY || DEFAULT_PUBLIC_KEY;

  if (typeof window !== 'undefined') {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed.serviceId && !parsed.serviceId.includes('your_')) {
          serviceId = parsed.serviceId.trim();
        }
        if (parsed.templateId && !parsed.templateId.includes('your_')) {
          templateId = parsed.templateId.trim();
        }
        if (parsed.publicKey && !parsed.publicKey.includes('your_')) {
          publicKey = parsed.publicKey.trim();
        }
      }
    } catch (e) {
      console.warn('Failed to parse EmailJS config from localStorage', e);
    }
  }

  return { serviceId, templateId, publicKey };
}

/**
 * Save EmailJS credentials to browser localStorage
 */
export function saveEmailJsConfig(config: EmailJSConfig) {
  if (typeof window !== 'undefined') {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
  }
}

/**
 * Send an OTP code to a user's email using EmailJS
 * Features hybrid delivery:
 * 1. Direct browser dispatch via @emailjs/browser SDK
 * 2. Automatic backend fallback via /api/auth/otp/ to bypass browser adblockers
 */
export async function sendOtpEmail(
  toEmail: string,
  otpCode: string,
  recipientName: string = 'User'
): Promise<{ success: boolean; message?: string; error?: string; unconfigured?: boolean }> {
  const config = getEmailJsConfig();

  if (!config.serviceId || !config.templateId || !config.publicKey) {
    return {
      success: false,
      unconfigured: true,
      error: 'EmailJS credentials are not configured yet.',
    };
  }

  const cleanEmail = toEmail.trim();
  const cleanName = recipientName.trim() || cleanEmail.split('@')[0];

  // Comprehensive template parameters matching any EmailJS template configuration
  const templateParams = {
    // Recipient address variations
    email: cleanEmail,
    to_email: cleanEmail,
    user_email: cleanEmail,
    to: cleanEmail,
    recipient: cleanEmail,
    recipient_email: cleanEmail,
    reply_to: cleanEmail,
    // Recipient name variations
    to_name: cleanName,
    name: cleanName,
    user_name: cleanName,
    // Sender branding
    from_name: 'SmartLearn Education Ecosystem',
    app_name: 'SmartLearn Education',
    // OTP Code variations
    otp: otpCode,
    otp_code: otpCode,
    code: otpCode,
    passcode: otpCode,
    verification_code: otpCode,
    user_otp: otpCode,
    OTP: otpCode,
    time_limit: '10 minutes',
    // Formatted message
    message: `Your SmartLearn verification code is ${otpCode}. It is valid for 10 minutes. Please enter this code to verify your account.`,
  };

  let clientError: string | null = null;

  // 1. Try browser-side EmailJS SDK first
  try {
    if (typeof window !== 'undefined') {
      try {
        emailjs.init({ publicKey: config.publicKey });
      } catch {
        // ignore init warning if already initialized
      }

      const response = await emailjs.send(
        config.serviceId,
        config.templateId,
        templateParams,
        config.publicKey
      );

      if (response.status === 200) {
        return {
          success: true,
          message: `OTP email successfully dispatched to ${cleanEmail} via EmailJS.`,
        };
      }
    }
  } catch (err: unknown) {
    clientError =
      err && typeof err === 'object' && 'text' in err
        ? String((err as { text: unknown }).text)
        : err instanceof Error
        ? err.message
        : 'Browser client EmailJS dispatch failed';
    console.warn('Browser EmailJS dispatch encountered an issue, trying server proxy:', clientError);
  }

  // 2. Automatic Server Fallback (bypasses adblockers and CORS restrictions)
  try {
    const serverRes = await fetch('/api/auth/otp/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'request',
        identifier: cleanEmail,
        name: cleanName,
        code: otpCode,
      }),
    });

    if (serverRes.ok) {
      const data = await serverRes.json();
      if (data.emailDispatched) {
        return {
          success: true,
          message: `Verification code delivered to ${cleanEmail} via EmailJS.`,
        };
      } else if (data.emailError) {
        return {
          success: false,
          error: data.emailError,
        };
      }
    }
  } catch (serverErr: unknown) {
    console.error('Server fallback EmailJS error:', serverErr);
  }

  // If client encountered a specific error, return it
  if (clientError) {
    return {
      success: false,
      error: clientError,
    };
  }

  return {
    success: false,
    error: 'Failed to dispatch email. Please check your EmailJS service connection.',
  };
}
