# Getting real auto-send-to-WhatsApp working

Your form now posts to a serverless function that calls Meta's official
WhatsApp Business Cloud API and sends the message straight to your phone —
the customer never touches WhatsApp. You need to connect that function to
your own WhatsApp Business account. About 15–20 minutes, no coding.

## 1. Create the Meta app & WhatsApp product
1. Go to https://developers.facebook.com/apps and log in with a Facebook account.
2. **Create App** → choose **Business** → name it (e.g. "Mobile Garage").
3. In the app dashboard, find **WhatsApp** in the product list and click **Set up**.
4. This gives you:
   - A **temporary access token** (valid 24h — fine for testing, see step 4 for permanent)
   - A **test phone number** already provided by Meta, with its **Phone Number ID**

## 2. Add your real number as a recipient (test mode)
While in developer/test mode, WhatsApp only delivers to numbers you've added:
1. In the WhatsApp > API Setup screen, find **"To"** field / **Manage phone number list**.
2. Add your own WhatsApp number (the one you want requests sent to).
3. Meta will send YOUR phone a verification code via WhatsApp — enter it.

## 3. Note down three values
- `WHATSAPP_TOKEN` — the access token from step 1
- `WHATSAPP_PHONE_NUMBER_ID` — the Phone Number ID from step 1 (this is the *sending* number, Meta's test number is fine to start)
- `WHATSAPP_RECIPIENT_NUMBER` — your own number in international format with no `+` or spaces, e.g. `233554178706`

## 4. Get a permanent token (so it doesn't expire in 24h)
1. In Meta Business Suite → **Business Settings** → **System Users**, create a system user.
2. Assign it to your app with `whatsapp_business_messaging` permission.
3. Generate a token with no expiry — use this instead of the temporary one.

## 5. Deploy this site to Netlify
1. Go to https://app.netlify.com → **Add new site** → **Deploy manually**.
2. Drag the whole `mobile-garage` folder onto the upload area.
3. Once deployed, go to **Site settings → Environment variables** and add the three values from step 3.
4. **Trigger a redeploy** (Deploys tab → Trigger deploy) so the function picks up the variables.

## 6. Test it
Fill out the form on your new site. The message should land in your WhatsApp
within a few seconds — no tapping required on the customer's end.

## Important limitation to know about
WhatsApp only allows free-form messages like this within a **24-hour window**
after the recipient last messaged that business number, OR Meta requires an
approved **message template** for the first contact. Since you (the recipient)
won't be messaging the test number regularly, you may see delivery fail after
the first day. The fix is to create a simple **template message** (e.g.
"New request: {{name}}, {{phone}}...") and get it approved in Meta Business
Suite (~a few minutes to a day) — I can adjust the function to use a template
call instead of a plain text call once you have one approved, just let me know.

## Going live (beyond test mode)
Test mode + Meta's test number works indefinitely for low volume, but to use
your own business number and remove Meta's "test" branding, you'll need to
verify your business in Meta Business Manager. Not required to get this
working today.
