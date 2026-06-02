const mongoose = require("mongoose");

const reservationSchema = new mongoose.Schema(
  {
    name: String,
    email: String,
    phone: String,
    carModel: String,
    serviceType: String,
    date: String,
    time: String,
    message: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model(
  "Reservation",
  reservationSchema
);