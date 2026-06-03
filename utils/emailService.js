const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: "smtp-relay.brevo.com",
  port: 587,
  secure: false,
  requireTLS: true,

  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },

  connectionTimeout: 15000,
  greetingTimeout: 15000,
  socketTimeout: 15000,

  tls: {
    rejectUnauthorized: false,
  },
});

const sendEmail = async (options) => {
  try {
    await transporter.sendMail({
      from: `"JOOGAD AUTOMART" <${process.env.EMAIL_USER}>`,
      to: options.to,
      subject: options.subject,
      text: options.text,
    });

    console.log("EMAIL SENT SUCCESSFULLY");
  } catch (error) {
    console.log("EMAIL ERROR:", error.message);
  }
};

module.exports = sendEmail;