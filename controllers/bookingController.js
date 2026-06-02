const Booking = require("../models/Booking");
const sendEmail = require("../utils/emailService");

exports.createBooking = async (req, res) => {
  try {
    const booking = await Booking.create({
      user: req.user.id,
      ...req.body,
    });

    // 📅 USER EMAIL
    await sendEmail(
      req.user.email,
      "📅 Booking Confirmation: JOOGAD AUTOMART",
      `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto;">
        
        <h2>Booking Confirmed ✅</h2>

        <p>Hello ${req.user.name},</p>

        <p>Your service booking has been received successfully.</p>

        <div style="background:#f4f4f4;padding:15px;border-radius:8px;">
          <p><strong>Service:</strong> ${req.body.serviceType}</p>
          <p><strong>Date:</strong> ${req.body.date}</p>
          <p><strong>Status:</strong> Pending Confirmation</p>
        </div>

        <p>We will contact you shortly.</p>
      </div>
      `
    );

    // 📅 ADMIN EMAIL
    await sendEmail(
      process.env.ADMIN_EMAIL,
      "🚨 New Booking Received: JOOGAD AUTOMART",
      `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto;">
        
        <h2>New Service Booking 📅</h2>

        <div style="background:#f4f4f4;padding:15px;border-radius:8px;">
          <p><strong>User:</strong> ${req.user.name}</p>
          <p><strong>Email:</strong> ${req.user.email}</p>
          <p><strong>Service:</strong> ${req.body.serviceType}</p>
          <p><strong>Date:</strong> ${req.body.date}</p>
        </div>

      </div>
      `
    );

    res.status(201).json({
      success: true,
      message: "Booking created successfully",
      data: booking,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 👤 GET USER BOOKINGS
exports.getUserBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user.id })
      .populate("car")
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: bookings.length,
      data: bookings,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 🔐 ADMIN - GET ALL BOOKINGS
exports.getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find()
      .populate("user", "name email")
      .populate("car")
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: bookings.length,
      data: bookings,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✏️ UPDATE BOOKING STATUS (ADMIN)
exports.updateBookingStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    booking.status = status || booking.status;

    await booking.save();

    res.json({
      success: true,
      message: "Booking updated successfully",
      data: booking,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ❌ DELETE BOOKING
exports.deleteBooking = async (req, res) => {
  try {
    await Booking.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: "Booking deleted successfully",
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};