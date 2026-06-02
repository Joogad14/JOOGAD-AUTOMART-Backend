const express = require("express");
const router = express.Router();
const sendEmail = require("../utils/emailService");

router.get("/send", async (req, res) => {
  try {
    await sendEmail(
      "jaogunsola65@student.lautech.edu.ng",
      "🔥 Nodemailer Test",
      `
      <h2>Email Test Successful 🎉</h2>
      <p>If you received this, Nodemailer is working perfectly.</p>
      `
    );

    res.json({ success: true, message: "Email sent successfully" });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Email failed",
      error: error.message,
    });
  }
});

module.exports = router;