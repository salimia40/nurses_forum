/**
 * Mock Email Service for Development
 *
 * This service simulates sending emails by logging to the console.
 * It's meant for development purposes only.
 */

/**
 * Sends a mock email and logs the details to console
 */
export const sendEmail = async ({
  to,
  subject,
  body,
}: {
  to: string;
  subject: string;
  body: string;
}) => {
  console.log('\n---------- MOCK EMAIL SERVICE ----------');
  console.log(`To: ${to}`);
  console.log(`Subject: ${subject}`);
  console.log('Body:');
  console.log(body);
  console.log('---------------------------------------\n');

  return { success: true };
};

/**
 * Sends a magic link email
 */
export const sendMagicLinkEmail = async ({
  email,
  url,
}: {
  email: string;
  token: string;
  url: string;
}) => {
  return sendEmail({
    to: email,
    subject: 'لینک ورود به سامانه پرستاران',
    body: `
سلام،

برای ورود به حساب کاربری خود، لطفا روی لینک زیر کلیک کنید:

${url}

این لینک تا ۱۵ دقیقه معتبر است.

با تشکر،
تیم سامانه پرستاران
    `,
  });
};

/**
 * Sends an OTP verification email
 */
export const sendOTPEmail = async ({
  email,
  otp,
  type,
}: {
  email: string;
  otp: string;
  type: string;
}) => {
  let subject = 'کد تایید سامانه پرستاران';
  let bodyPrefix = 'کد تایید شما برای ';

  if (type === 'signup') {
    bodyPrefix = 'کد تایید شما برای ثبت نام ';
  } else if (type === 'login') {
    bodyPrefix = 'کد تایید شما برای ورود ';
  } else if (type === 'reset-password') {
    bodyPrefix = 'کد تایید شما برای بازیابی رمز عبور ';
    subject = 'بازیابی رمز عبور سامانه پرستاران';
  }

  return sendEmail({
    to: email,
    subject,
    body: `
سلام،

${bodyPrefix}در سامانه پرستاران:

${otp}

این کد تا ۱۵ دقیقه معتبر است.

با تشکر،
تیم سامانه پرستاران
    `,
  });
};
