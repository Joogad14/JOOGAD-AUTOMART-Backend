const nodemailer = require("nodemailer");

const sendEmail = async (options) => {

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  await transporter.sendMail({
    from: `"JOOGAD AUTOMART" <${process.env.EMAIL_USER}>`,
    
    to: options.to,

    subject: options.subject,

    text: options.text,

    html: options.html,
  });
};

module.exports = sendEmail;