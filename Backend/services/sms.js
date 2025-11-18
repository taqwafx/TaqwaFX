import twilio from "twilio";

const client = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

export async function sendSMS(to, body) {
  try {
    const msg = await client.messages.create({
      from: process.env.TWILIO_SMS_FROM,
      to: to, // +91xxxxxxxxxx
      body: body,
    });

    console.log("SMS Sent:", msg.sid);
    return true;
  } catch (e) {
    console.log("SMS Error:", e.message);
    return false;
  }
}

