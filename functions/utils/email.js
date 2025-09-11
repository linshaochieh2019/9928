import sgMail from "@sendgrid/mail";
import * as dotenv from "dotenv";

// Load .env.local for local development only
dotenv.config({ path: ".env.local" });

// Initialize SendGrid with API key
const sendgridKey = process.env.SENDGRID_API_KEY;

if (!sendgridKey) {
  console.error("❌ Missing SENDGRID_API_KEY");
} else {
  sgMail.setApiKey(sendgridKey);
}

/**
 * Send an email using SendGrid
 * @param {string} to - recipient email
 * @param {string} subject - subject line
 * @param {string} html - HTML body
 * @param {string} [text] - optional plain text body
 */
export async function sendEmail(to, subject, html, text) {
  const msg = {
    to,
    from: {
      email: "support@9928tw.com",
      name: "9928 Support"   // 👈 friendly name
    }, 
    subject,
    text: text || "",
    html,
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