const express = require("express");
const router = express.Router();

const {
  createBooking,
  getUserBookings,
  getAllBookings,
  updateBookingStatus,
  deleteBooking,
} = require("../controllers/bookingController");

const protect = require("../middleware/authMiddleware");
const admin = require("../middleware/adminMiddleware");

// 👤 USER ROUTES
router.post("/", protect, createBooking);
router.get("/my-bookings", protect, getUserBookings);

// 🔐 ADMIN ROUTES
router.get("/", protect, admin, getAllBookings);
router.put("/:id", protect, admin, updateBookingStatus);
router.delete("/:id", protect, admin, deleteBooking);

module.exports = router;