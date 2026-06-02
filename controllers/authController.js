const crypto = require("crypto");
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const sendEmail = require("../utils/emailService");
const admin = require("../utils/firebaseAdmin");

const generateToken = require("../utils/generateToken");

// 👤 REGISTER USER
exports.registerUser = async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      phoneNumber,
      gender,
      address,
      occupation,
      educationLevel,
      nextOfKin,
    } = req.body;

    // ✅ CHECK IF USER EXISTS
    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(400).json({
        success: false,
        message: "User already exists",
      });
    }

    // ✅ HASH PASSWORD
    const hashedPassword = await bcrypt.hash(password, 10);

    // ✅ CREATE USER
    const user = await User.create({
      name,
      email,
      password: hashedPassword,

      phoneNumber,
      gender,
      address,
      occupation,
      educationLevel,

      nextOfKin,
    });

    // ✅ SEND WELCOME EMAIL
    try {

      const ip =
        req.headers["x-forwarded-for"] ||
        req.socket.remoteAddress;

      const loginTime =
        new Date().toLocaleString("en-NG", {
          timeZone: "Africa/Lagos",
          dateStyle: "medium",
          timeStyle: "short",
        });

      await sendEmail({
        to: user.email,

        subject: "🎉 Welcome to JOOGAD AUTOMART",

        text: `
Hello ${user.name},

🎉 Congratulations and welcome to JOOGAD AUTOMART family!

Your account has been successfully created.

📅 Time: ${loginTime}
🌍 IP Address: ${ip}

You can now login and explore our services:
- Car purchases
- Service booking
- Reservations

If this was not you, please contact our support immediately.

Regards,
JOOGAD AUTOMART Team
`,
      });

    } catch (err) {

      console.log(
        "Email failed:",
        err.message
      );

    }

    // ✅ RESPONSE
    res.status(201).json({
      success: true,

      message:
        "Account created successfully",

      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,

        phoneNumber: user.phoneNumber,
        gender: user.gender,
        address: user.address,
        occupation: user.occupation,
        educationLevel:
          user.educationLevel,

        nextOfKin: user.nextOfKin,

        token: generateToken(
          user._id,
          user.role
        ),
      },
    });

  } catch (error) {

  console.log("REGISTER ERROR:");
  console.log(error);

  res.status(500).json({
    success: false,
    message: error.message,
  });
}
};

// 🔐 LOGIN USER
exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // ✅ FIND USER
    const user = await User.findOne({ email });

    // ❌ INVALID USER
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    // 🚫 BLOCKED ACCOUNT
    if (user.isBlocked) {
      return res.status(403).json({
        success: false,
        message: "Your account has been blocked",
      });
    }

    // ✅ CHECK PASSWORD
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    try {
      const ip = req.headers["x-forwarded-for"] || req.socket.remoteAddress;

   const loginTime = new Date().toLocaleString("en-NG", {
      timeZone: "Africa/Lagos",
      dateStyle: "medium",
      timeStyle: "short",
    });

    await sendEmail({
  to: user.email,

  subject: "🔐 New Login to Your Account",

  text: `
Hello ${user.name},

A login just occurred on your account.

📅 Time: ${loginTime}
🌍 IP Address: ${ip}

If this was YOU, you can ignore this message.

If this was NOT you, please:
- Change your password immediately
- Contact support

Stay safe,
JOOGAD AUTOMART Security Team
`,
});
 } catch (err) {
  console.log("Email failed:", err.message);
}

    // ✅ LOGIN SUCCESS
    res.status(200).json({
      success: true,

      message: `Welcome back ${user.name}`,

      data: {
        _id: user._id,
        name: user.name,
        email: user.email,

        role: user.role,

        phoneNumber: user.phoneNumber,
        gender: user.gender,
        address: user.address,
        occupation: user.occupation,
        educationLevel: user.educationLevel,

        nextOfKin: user.nextOfKin,

        profileImage: user.profileImage,
        isVerified: user.isVerified,

        token: generateToken(user._id, user.role),
      },
    });

  } catch (error) {

  console.log("LOGIN ERROR:");
  console.log(error);

  res.status(500).json({
    success: false,
    message: error.message,
  });
}
};

exports.googleLogin = async (req, res) => {
  try {

    const { token } = req.body;

    // VERIFY FIREBASE TOKEN
    const decodedToken = await admin
      .auth()
      .verifyIdToken(token);

    const {
      name,
      email,
      picture,
    } = decodedToken;

    // CHECK IF USER EXISTS
    let user = await User.findOne({ email });

    // CREATE USER IF NOT EXIST
    if (!user) {

      user = await User.create({
        name,
        email,

        password: "",

        profileImage: picture || "",

        phoneNumber: "",
        gender: "male",
        address: "",
        occupation: "",
        educationLevel: "other",

        nextOfKin: {
          name: "",
          phoneNumber: "",
          address: "",
        },

        isVerified: true,
      });

      // SEND WELCOME EMAIL
      try {
         const ip = req.headers["x-forwarded-for"] || req.socket.remoteAddress;

  const loginTime = new Date().toLocaleString("en-NG", {
      timeZone: "Africa/Lagos",
      dateStyle: "medium",
      timeStyle: "short",
    });

        await sendEmail({
          to: user.email,

          subject:
            "🎉 Welcome to JOOGAD AUTOMART",

          text: `
Hello ${user.name},

Welcome to JOOGAD AUTOMART family.

Your Google account has been linked successfully.
📅 Time: ${loginTime}
🌍 IP Address: ${ip}

You can now login and explore our services:
  - Car purchases
  - Service booking
  - Reservations

Regards,
JOOGAD AUTOMART Team
          `,
        });

      } catch (err) {

        console.log(
          "Google welcome email failed:",
          err.message
        );
      }
    }

    // GENERATE JWT
    const jwtToken = generateToken(user._id);

    // RESPONSE
    res.status(200).json({
      success: true,

      message:
        "Google login successful",

      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,

        profileImage:
          user.profileImage,

        token: jwtToken,
      },
    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      success: false,
      message:
        "Google authentication failed",
    });
  }
};

exports.forgotPassword = async (req, res) => {
try {


const { email } = req.body;

// CHECK USER
const user = await User.findOne({ email });

if (!user) {
  return res.status(404).json({
    success: false,
    message: "No user found with this email",
  });
}

// GENERATE RESET TOKEN
const resetToken = crypto
  .randomBytes(32)
  .toString("hex");

// HASH TOKEN
const hashedToken = crypto
  .createHash("sha256")
  .update(resetToken)
  .digest("hex");

// SAVE TOKEN
user.resetPasswordToken = hashedToken;

// 15 MINUTES
user.resetPasswordExpire =
  Date.now() + 15 * 60 * 1000;

await user.save();

// RESET URL
const resetUrl =
  `http://localhost:5173/reset-password/${resetToken}`;

// SEND EMAIL
await sendEmail({
  to: user.email,

  subject: "🔐 Password Reset Request",

  text: `


Hello ${user.name},

We received a request to reset your password.

Click the link below to reset it:

${resetUrl}

This link expires in 15 minutes.

If you did not request this,
please ignore this email.

Regards,
JOOGAD AUTOMART Team
`,
});

res.status(200).json({
  success: true,
  message:
    "Password reset link sent to email",
});

} catch (error) {

res.status(500).json({
  success: false,
  message: error.message,
});

}
};

exports.resetPassword = async (req, res) => {
try {


// HASH TOKEN FROM URL
const hashedToken = crypto
  .createHash("sha256")
  .update(req.params.token)
  .digest("hex");

// FIND USER
const user = await User.findOne({
  resetPasswordToken: hashedToken,

  resetPasswordExpire: {
    $gt: Date.now(),
  },
});

// INVALID TOKEN
if (!user) {
  return res.status(400).json({
    success: false,
    message:
      "Reset token is invalid or expired",
  });
}

// HASH NEW PASSWORD
const hashedPassword =
  await bcrypt.hash(req.body.password, 10);

// SAVE NEW PASSWORD
user.password = hashedPassword;

// CLEAR TOKEN
user.resetPasswordToken = "";
user.resetPasswordExpire = null;

await user.save();

res.status(200).json({
  success: true,
  message:
    "Password reset successful",
});


} catch (error) {

res.status(500).json({
  success: false,
  message: error.message,
});


}
};