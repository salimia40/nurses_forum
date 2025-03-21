/**
 * Mock SMS Service for Development
 *
 * This service simulates sending SMS messages by logging to the console.
 * It's meant for development purposes only.
 */

/**
 * Sends a mock SMS and logs the details to console
 */
export const sendSMS = async ({ to, message }: { to: string; message: string }) => {
  console.log('\n---------- MOCK SMS SERVICE ----------');
  console.log(`To: ${to}`);
  console.log('Message:');
  console.log(message);
  console.log('--------------------------------------\n');

  return { success: true };
};

/**
 * Sends an OTP code via SMS
 */
export const sendOTPSMS = async ({ phoneNumber, code }: { phoneNumber: string; code: string }) => {
  return sendSMS({
    to: phoneNumber,
    message: `
کد تایید سامانه پرستاران:
${code}

این کد تا ۱۵ دقیقه معتبر است.
    `.trim(),
  });
};
