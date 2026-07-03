
// Netlify serverless function.
// Sends the booking form data as a plain SMS via Twilio.

export async function handler(event) {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method not allowed' };
  }

  const { name, phone, location, service, problem } = JSON.parse(event.body || '{}');

  if (!name || !phone || !location || !service || !problem) {
    return {
      statusCode: 400,
      body: JSON.stringify({ success: false, error: 'Missing required fields' }),
    };
  }

  const ACCOUNT_SID = process.env.TWILIO_ACCOUNT_SID;
  const AUTH_TOKEN = process.env.TWILIO_AUTH_TOKEN;
  const FROM_NUMBER = process.env.TWILIO_FROM_NUMBER; // Twilio number, e.g. +12345678901
  const TO_NUMBER = process.env.SMS_RECIPIENT_NUMBER; // owner's number, e.g. +233554178706

  if (!ACCOUNT_SID || !AUTH_TOKEN || !FROM_NUMBER || !TO_NUMBER) {
    return {
      statusCode: 500,
      body: JSON.stringify({ success: false, error: 'SMS API not configured' }),
    };
  }

  const messageText =
    `New mechanic request\n` +
    `Name: ${name}\n` +
    `Phone: ${phone}\n` +
    `Location: ${location}\n` +
    `Service: ${service}\n` +
    `Problem: ${problem}`;

  try {
    const basicAuth = Buffer.from(`${ACCOUNT_SID}:${AUTH_TOKEN}`).toString('base64');

    const body = new URLSearchParams({
      To: TO_NUMBER,
      From: FROM_NUMBER,
      Body: messageText,
    });

    const res = await fetch(
      `https://api.twilio.com/2010-04-01/Accounts/${ACCOUNT_SID}/Messages.json`,
      {
        method: 'POST',
        headers: {
          Authorization: `Basic ${basicAuth}`,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: body.toString(),
      }
    );

    const data = await res.json();

    if (!res.ok) {
      console.error('Twilio SMS error:', data);
      return {
        statusCode: 502,
        body: JSON.stringify({ success: false, error: data.message || 'SMS API error' }),
      };
    }

    console.log('SMS success response:', JSON.stringify(data));

    return {
      statusCode: 200,
      body: JSON.stringify({ success: true }),
    };
  } catch (err) {
    console.error(err);
    return {
      statusCode: 500,
      body: JSON.stringify({ success: false, error: 'Server error sending SMS' }),
    };
  }
}
