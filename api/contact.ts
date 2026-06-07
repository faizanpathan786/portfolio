import type { VercelRequest, VercelResponse } from "@vercel/node";

/** Where contact submissions are delivered. */
const TO_EMAIL = "faizan514pathan@gmail.com";

/**
 * Sender shown on the email. Until you verify a domain in Resend, this MUST
 * stay as the shared onboarding address (Resend only delivers to your own
 * account email in that mode). Once you verify a domain, change this to
 * something like "Portfolio <hello@yourdomain.com>".
 */
const FROM_EMAIL = "Portfolio <onboarding@resend.dev>";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { name, email, message, botcheck } = (req.body ?? {}) as Record<
    string,
    string
  >;

  // Honeypot — bots fill this; humans never see it.
  if (botcheck) return res.status(200).json({ success: true });

  if (!name?.trim() || !email?.trim() || !message?.trim()) {
    return res.status(400).json({ error: "Please fill in all fields." });
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return res.status(400).json({ error: "Please enter a valid email." });
  }

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.error("RESEND_API_KEY is not set");
    return res
      .status(500)
      .json({ error: "Email service is not configured yet." });
  }

  try {
    const resendRes = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: FROM_EMAIL,
        to: [TO_EMAIL],
        reply_to: email,
        subject: `New message from ${name} — Portfolio`,
        html: renderEmail({ name, email, message }),
        text: `New message from your portfolio\n\nName: ${name}\nEmail: ${email}\n\n${message}`,
      }),
    });

    if (!resendRes.ok) {
      const detail = await resendRes.text();
      console.error("Resend error:", resendRes.status, detail);
      return res
        .status(502)
        .json({ error: "Could not send your message. Please try again." });
    }

    return res.status(200).json({ success: true });
  } catch (err) {
    console.error("Contact handler error:", err);
    return res.status(500).json({ error: "Unexpected error. Please try again." });
  }
}

/** Escape user input before embedding it in HTML. */
function esc(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

/** Dark, on-brand HTML email matching the portfolio theme. */
function renderEmail({
  name,
  email,
  message,
}: {
  name: string;
  email: string;
  message: string;
}): string {
  const safeName = esc(name);
  const safeEmail = esc(email);
  const safeMessage = esc(message).replace(/\n/g, "<br />");

  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="color-scheme" content="dark" />
    <title>New portfolio message</title>
  </head>
  <body style="margin:0;padding:0;background-color:#0a0a0a;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#0a0a0a;padding:32px 16px;">
      <tr>
        <td align="center">
          <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background-color:#141414;border:1px solid #1f1f1f;border-radius:18px;overflow:hidden;">
            <!-- Accent gradient header -->
            <tr>
              <td style="background-color:#4e85bf;background-image:linear-gradient(90deg,#89aacc 0%,#4e85bf 100%);height:6px;line-height:6px;font-size:6px;">&nbsp;</td>
            </tr>
            <tr>
              <td style="padding:40px 40px 8px 40px;">
                <p style="margin:0;font-family:'Helvetica Neue',Arial,sans-serif;font-size:11px;letter-spacing:3px;text-transform:uppercase;color:#878787;">
                  New Inquiry
                </p>
                <h1 style="margin:10px 0 0 0;font-family:Georgia,'Times New Roman',serif;font-style:italic;font-weight:400;font-size:34px;line-height:1.15;color:#f5f5f5;">
                  You've got a new message
                </h1>
              </td>
            </tr>

            <!-- Details -->
            <tr>
              <td style="padding:28px 40px 8px 40px;">
                <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                  <tr>
                    <td style="padding-bottom:18px;">
                      <p style="margin:0 0 4px 0;font-family:'Helvetica Neue',Arial,sans-serif;font-size:11px;letter-spacing:2px;text-transform:uppercase;color:#878787;">From</p>
                      <p style="margin:0;font-family:'Helvetica Neue',Arial,sans-serif;font-size:16px;color:#f5f5f5;">${safeName}</p>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding-bottom:18px;">
                      <p style="margin:0 0 4px 0;font-family:'Helvetica Neue',Arial,sans-serif;font-size:11px;letter-spacing:2px;text-transform:uppercase;color:#878787;">Email</p>
                      <a href="mailto:${safeEmail}" style="font-family:'Helvetica Neue',Arial,sans-serif;font-size:16px;color:#89aacc;text-decoration:none;">${safeEmail}</a>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>

            <!-- Message -->
            <tr>
              <td style="padding:0 40px 8px 40px;">
                <p style="margin:0 0 8px 0;font-family:'Helvetica Neue',Arial,sans-serif;font-size:11px;letter-spacing:2px;text-transform:uppercase;color:#878787;">Message</p>
                <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#0a0a0a;border:1px solid #1f1f1f;border-radius:12px;">
                  <tr>
                    <td style="padding:20px 22px;font-family:'Helvetica Neue',Arial,sans-serif;font-size:15px;line-height:1.7;color:#e0e0e0;">
                      ${safeMessage}
                    </td>
                  </tr>
                </table>
              </td>
            </tr>

            <!-- Reply button -->
            <tr>
              <td style="padding:28px 40px 36px 40px;">
                <table role="presentation" cellpadding="0" cellspacing="0">
                  <tr>
                    <td style="background-color:#f5f5f5;border-radius:999px;">
                      <a href="mailto:${safeEmail}" style="display:inline-block;padding:13px 28px;font-family:'Helvetica Neue',Arial,sans-serif;font-size:14px;color:#0a0a0a;text-decoration:none;">
                        Reply to ${safeName} &rarr;
                      </a>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>

            <!-- Footer -->
            <tr>
              <td style="padding:20px 40px;border-top:1px solid #1f1f1f;">
                <p style="margin:0;font-family:'Helvetica Neue',Arial,sans-serif;font-size:12px;color:#5c5c5c;">
                  Sent from your portfolio contact form.
                </p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;
}
