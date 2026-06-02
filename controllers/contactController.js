const Contact = require("../models/Contact");
const sendEmail = require("../utils/emailService");

exports.createContact = async (req, res) => {
  try {
    const { subject, message } = req.body;

    if (!subject || !message) {
      return res.status(400).json({
        message: "Subject and message are required",
      });
    }

    const contact = await Contact.create({
      user: req.user.id,
      subject,
      message,
    });

    // USER EMAIL
    await sendEmail(
      req.user.email,
      "📩 Message Received: JOOGAD AUTOMART",
      `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto;">
        <h2>We Received Your Message ✅</h2>
        <p>Hello ${req.user.name},</p>
        <p>Thank you for contacting JOOGAD AUTOMART support.</p>
        <div style="background:#f4f4f4;padding:15px;border-radius:8px;">
          <p><strong>Subject:</strong> ${subject}</p>
          <p><strong>Message:</strong> ${message}</p>
        </div>
      </div>
      `
    );

    // ADMIN EMAIL
    await sendEmail(
      process.env.ADMIN_EMAIL,
      "🚨 New Contact Message: JOOGAD AUTOMART",
      `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto;">
        <h2>New Support Message 📩</h2>
        <div style="background:#f4f4f4;padding:15px;border-radius:8px;">
          <p><strong>User:</strong> ${req.user.name}</p>
          <p><strong>Email:</strong> ${req.user.email}</p>
          <p><strong>Subject:</strong> ${subject}</p>
          <p><strong>Message:</strong> ${message}</p>
        </div>
      </div>
      `
    );

    res.status(201).json({
      success: true,
      message: "Message sent successfully",
      data: contact,
    });
  } catch (error) {
    res.status(500).json({
      message: "Contact error",
      error: error.message,
    });
  }
};