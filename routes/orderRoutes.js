const express = require("express");
const router = express.Router();

const {
  createOrder,
  getUserOrders,
  getAllOrders,
  uploadPaymentProof,
  confirmPayment,
  updateOrder,
  deleteOrder,
} = require("../controllers/orderController");

const protect = require("../middleware/authMiddleware");
const admin = require("../middleware/adminMiddleware");


// ===============================
// 👤 USER ROUTES
// ===============================

// 🛒 CREATE ORDER
router.post("/", protect, createOrder);

// 📦 GET MY ORDERS
router.get("/my-orders", protect, getUserOrders);

// 📤 UPLOAD PAYMENT PROOF
router.put(
  "/upload-proof/:id",
  protect,
  uploadPaymentProof
);


// ===============================
// 🔐 ADMIN ROUTES
// ===============================

// 📦 GET ALL ORDERS
router.get("/", protect, admin, getAllOrders);

// ✅ CONFIRM PAYMENT
router.put(
  "/confirm-payment/:id",
  protect,
  admin,
  confirmPayment
);

// ✏️ UPDATE ORDER
router.put(
  "/:id",
  protect,
  admin,
  updateOrder
);

// ❌ DELETE ORDER
router.delete(
  "/:id",
  protect,
  admin,
  deleteOrder
);

module.exports = router;