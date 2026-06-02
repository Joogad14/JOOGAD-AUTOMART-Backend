process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
const dotenv = require("dotenv");
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");

dotenv.config();

// Connect Database
connectDB();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true })); // important for forms


// routes imports
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const adminRoutes = require("./routes/adminRoutes");
const carRoutes = require("./routes/carRoutes");
const orderRoutes = require("./routes/orderRoutes");
const bookingRoutes = require("./routes/bookingRoutes");
const contactRoutes = require("./routes/contactRoutes");
const testEmailRoutes = require("./routes/testEmailRoutes");
const paymentRoutes = require("./routes/paymentRoutes");
const reservationRoutes = require("./routes/reservationRoutes");


// test route
app.get("/", (req, res) => {
  res.send("AUTOMART API is running...");
});


// api routes
app.use("/api/auth", authRoutes)
app.use("/api/users", userRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/cars", carRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/contact", contactRoutes);
app.use("/api/reservations", reservationRoutes);
app.use("/api/test-email", testEmailRoutes);
app.use("/api/payments", paymentRoutes);



// GLOBAL ERROR HANDLER (OPTIONAL BUT PRO)
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: "Server Error",
    error: err.message,
  });
});


// Server 
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});