const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    // 👤 BASIC DETAILS
    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    password: {
  type: String,
  default: "",
},

googleId: {
  type: String,
  default: "",
},

authProvider: {
  type: String,
  enum: ["local", "google"],
  default: "local",
},
    // 🔐 ROLE
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },

    // 📱 PHONE NUMBER
    phoneNumber: {
      type: String,
      default: "",
    },

    // 🚻 GENDER
    gender: {
      type: String,
      enum: ["male", "female"],
      default: "male",
    },

    // 🏠 CONTACT ADDRESS
    address: {
      type: String,
      default: "",
    },

    // 💼 OCCUPATION
    occupation: {
      type: String,
      default: "",
    },

    // 🎓 HIGHEST EDUCATION LEVEL
    educationLevel: {
      type: String,
      enum: [
        "secondary_school",
        "diploma",
        "bachelor_degree",
        "master_degree",
        "phd",
        "other",
      ],
      default: "other",
    },

    // 👨‍👩‍👦 NEXT OF KIN DETAILS
    nextOfKin: {
      name: {
        type: String,
        default: "",
      },

      phoneNumber: {
        type: String,
        default: "",
      },

      address: {
        type: String,
        default: "",
      },
    },

    // 🖼️ PROFILE IMAGE
    profileImage: {
      type: String,
      default: "",
    },
    

    // ✅ ACCOUNT STATUS
    isVerified: {
      type: Boolean,
      default: false,
    },


    // 🚫 ACCOUNT BLOCK STATUS
    isBlocked: {
      type: Boolean,
      default: false,
    },
    // 🔑 RESET PASSWORD TOKEN
resetPasswordToken: {
  type: String,
  default: "",
},

// ⏰ RESET PASSWORD TOKEN EXPIRY
resetPasswordExpire: {
  type: Date,
},
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);