const mongoose = require("mongoose");

const carSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    brand: {
      type: String,
      required: true,
      trim: true,
    },

    model: {
      type: String,
      required: true,
      trim: true,
    },

    year: {
      type: Number,
      required: true,
    },

    price: {
      type: Number,
      required: true,
    },

    condition: {
      type: String,
      enum: ["new", "used"],
      required: true,
    },

    description: {
      type: String,
      default: "",
    },

    // ✅ CLOUDINARY IMAGE URLS
    images: [
      {
        type: String,
      },
    ],

    // ✅ AVAILABLE / SOLD
    availability: {
      type: String,
      enum: ["available", "sold"],
      default: "available",
    },

    // ✅ FEATURED CARS FOR HOMEPAGE
    featured: {
      type: Boolean,
      default: false,
    },

    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Car", carSchema);