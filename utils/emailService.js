const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,

  port: process.env.EMAIL_PORT,

  secure: false,

  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
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