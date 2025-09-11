const express = require("express");
const { sendEmail } = require("../utils/email");

const router = express.Router();

router.post("/test", async (req, res) => {
  try {
    await sendEmail(
      "linshaochieh2019@gmail.com",
      "Hello from 9928 🚀",
      "<p>This is a test email</p>",
      "This is a plain text version"
    );
    res.json({ success: true, message: "Email sent" });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;
