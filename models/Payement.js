const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },

  items: [
    {
      name: String,
      price: Number,
      quantity: Number,
    }
  ],

  totalPrice: Number,

  isPaid: {
    type: Boolean,
    default: false,
  },

  paymentStatus: {
    type: String,
    default: "pending",
  },

  paymentReference: String,

}, { timestamps: true });

module.exports = mongoose.model("Order", orderSchema);