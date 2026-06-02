const express = require("express");
const router = express.Router();

const {
  initializePayment,
  verifyPayment
} = require("../controllers/paymentController");

const protect = require("../middleware/authMiddleware");

// INIT PAYMENT
router.post("/initialize/:orderId", protect, initializePayment);

// VERIFY PAYMENT
router.get("/verify/:reference", verifyPayment);

module.exports = router;