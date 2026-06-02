const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    // 👤 USER
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // 🚗 CAR
    car: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Car",
      required: true,
    },

    // 💰 FULL CAR PRICE
    amount: {
      type: Number,
      required: true,
    },

    // 💳 INITIAL DEPOSIT
    depositAmount: {
      type: Number,
      required: true,
    },

    // 💵 REMAINING BALANCE
    balanceAmount: {
      type: Number,
      required: true,
    },

    // 💳 PAYMENT METHOD
    paymentMethod: {
      type: String,
      enum: ["bank_transfer", "paystack"],
      default: "bank_transfer",
    },

    // 📸 PAYMENT PROOF IMAGE
    paymentProof: {
      type: String,
      default: "",
    },

    // 📌 PAYMENT STATUS
    paymentStatus: {
      type: String,
      enum: [
        "unpaid",
        "pending_verification",
        "deposit_paid",
        "fully_paid",
      ],
      default: "unpaid",
    },

    // 📦 ORDER STATUS
    status: {
      type: String,
      enum: [
        "pending",
        "processing",
        "delivered",
        "cancelled",
      ],
      default: "pending",
    },

    // 🔖 PAYMENT REFERENCE
    paymentReference: {
      type: String,
      default: "",
    },

    // 🏦 BANK TRANSFER DETAILS
    bankName: {
      type: String,
      default: "OPay",
    },

    accountName: {
      type: String,
      default: "JOSHUA ADEYEMI OGUNSOLA",
    },

    accountNumber: {
      type: String,
      default: "7048079078",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Order", orderSchema);