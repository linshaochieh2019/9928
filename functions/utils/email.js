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