const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",

  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },

  connectionTimeout: 10000,
});

const sendEmail = async (options) => {

  try {

    await transporter.sendMail({
      from: `"JOOGAD AUTOMART" <${process.env.EMAIL_USER}>`,

      to: options.to,

      subject: options.subject,

      text: options.text,
    });

    console.log("Email sent successfully");

  } catch (error) {

    console.log("EMAIL ERROR:", error.message);

    // IMPORTANT:
    // prevent server crash
    return;
  }
};

module.exports = sendEmail;