import sgMail from "@sendgrid/mail";
import * as dotenv from "dotenv";
import { defineSecret } from "firebase-functions/params"; // 👈 fixed

// Load .env.local for local development only
dotenv.config({ path: ".env.local" });

// Access SENDGRID_API_KEY from env or Firebase Secret Manager
const SENDGRID_API_KEY = defineSecret("SENDGRID_API_KEY");

function getSendGridKey() {
  return (typeof SENDGRID_API_KEY.value === "function"
    ? SENDGRID_API_KEY.value()
    : process.env.SENDGRID_API_KEY);
}


// lazy init flag
let initialized = false;
function initSendGrid() {
  if (!initialized) {
    const key = getSendGridKey();
    sgMail.setApiKey(key);
    initialized = true;
    console.log("✅ SendGrid initialized");
  }
}

/**
 * Send an email using SendGrid
 * @param {string} to - recipient email
 * @param {string} subject - subject line
 * @param {string} html - HTML body
 * @param {string} [text] - optional plain text body
 */
export async function sendEmail(to, subject, html, text) {
  initSendGrid(); // 👈 init only when function is invoked

  const msg = {
    to,
    from: {
      email: "support@9928tw.com",
      name: "9928 Support"   // 👈 friendly name
    },
    subject,
    text: text || "",
    html,
    trackingSettings: {
      clickTracking: { enable: false }
    }
  };

  try {
    await sgMail.send(msg);
    console.log(`✅ Email sent to ${to}`);
    return true;
  } catch (err) {
    console.error("❌ Email failed:", err);
    throw err;
  }
}

/**
 * Build reusable branded HTML email template
 */
export function buildEmailTemplate(title, message, buttonUrl, buttonText) {
  return `
  <!DOCTYPE html>
  <html lang="en" style="margin:0;padding:0;">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width" />
    <title>${title}</title>
  </head>
  <body style="margin:0;padding:0;background-color:#f6f9fc;font-family:Arial, sans-serif;color:#333;">
    <table align="center" cellpadding="0" cellspacing="0" width="100%" style="padding:20px 0;">
      <tr>
        <td>
          <table align="center" cellpadding="0" cellspacing="0" width="600" style="background:#fff;border-radius:8px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,0.05);">
            <tr>
              <td align="center" bgcolor="#287279" style="padding:24px;">
                <h1 style="margin:0;color:#fff;font-size:22px;font-weight:bold;">🚀 9928 Support</h1>
              </td>
            </tr>
            <tr>
              <td style="padding:30px;">
                <h2 style="margin-top:0;margin-bottom:16px;font-size:20px;color:#333;">${title}</h2>
                <p style="margin:0 0 24px;font-size:15px;line-height:1.6;">${message}</p>
                ${
                  buttonUrl
                    ? `
                <div style="text-align:center;margin-bottom:30px;">
                  <a href="${buttonUrl}" style="background:#287279;color:#fff;padding:12px 24px;border-radius:6px;text-decoration:none;font-size:15px;font-weight:bold;display:inline-block;">
                    ${buttonText}
                  </a>
                </div>`
                    : ""
                }
              </td>
            </tr>
            <tr>
              <td align="center" style="padding:20px;background:#f1f3f5;color:#777;font-size:12px;">
                <p style="margin:0;">© 2025 9928. All rights reserved.</p>
                <p style="margin:4px 0 0;">You’re receiving this email because you have an account with 9928.</p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
  </html>
  `;
}
