// Netlify serverless function.
// Receives the booking form data and sends it straight to the garage
// owner's WhatsApp using the official WhatsApp Business Cloud API.
// No "tap send" step for the customer — this happens server-side.

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

  const TOKEN = process.env.WHATSAPP_TOKEN;
  const PHONE_NUMBER_ID = process.env.WHATSAPP_PHONE_NUMBER_ID;
  const RECIPIENT = process.env.WHATSAPP_RECIPIENT_NUMBER; // owner's number, e.g. 233554178706

  if (!TOKEN || !PHONE_NUMBER_ID || !RECIPIENT) {
    return {
      statusCode: 500,
      body: JSON.stringify({ success: false, error: 'WhatsApp API not configured' }),
    };
  }

  const messageText =
    `New mechanic request\n\n` +
    `Name: ${name}\n` +
    `Phone: ${phone}\n` +
    `Location: ${location}\n` +
    `Service: ${service}\n` +
    `Problem: ${problem}`;

  try {
    const res = await fetch(
      `https://graph.facebook.com/v20.0/${PHONE_NUMBER_ID}/messages`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${TOKEN}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messaging_product: 'whatsapp',
          to: RECIPIENT,
          type: 'text',
          text: { body: messageText },
        }),
      }
    );

    const data = await res.json();

    if (!res.ok) {
      console.error('WhatsApp API error:', data);
      return {
        statusCode: 502,
        body: JSON.stringify({ success: false, error: data.error?.message || 'WhatsApp API error' }),
      };
    }

    console.log('WhatsApp API success response:', JSON.stringify(data));

    return {
      statusCode: 200,
      body: JSON.stringify({ success: true }),
    };
  } catch (err) {
    console.error(err);
    return {
      statusCode: 500,
      body: JSON.stringify({ success: false, error: 'Server error sending WhatsApp message' }),
    };
  }
}
