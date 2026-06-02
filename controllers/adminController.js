const User = require("../models/User");
const Car = require("../models/Car");
const Order = require("../models/Order");
const Booking = require("../models/Booking");

// 📊 ADMIN DASHBOARD STATS
exports.getDashboardStats = async (req, res) => {
  try {
    // 👥 TOTAL USERS
    const totalUsers = await User.countDocuments();

    // 🚗 TOTAL CARS
    const totalCars = await Car.countDocuments();

    // 📦 TOTAL ORDERS
    const totalOrders = await Order.countDocuments();

    // 📅 TOTAL BOOKINGS
    const totalBookings = await Booking.countDocuments();

    // 💰 TOTAL REVENUE
    const revenueData = await Order.aggregate([
      {
        $match: {
          paymentStatus: {
            $in: ["deposit_paid", "fully_paid"],
          },
        },
      },

      {
        $group: {
          _id: null,
          totalRevenue: {
            $sum: "$depositAmount",
          },
        },
      },
    ]);

    const totalRevenue = revenueData[0]?.totalRevenue || 0;

    // ⏳ PENDING ORDERS
    const pendingOrders = await Order.countDocuments({
      status: "pending",
    });

    // 🚚 PROCESSING ORDERS
    const processingOrders = await Order.countDocuments({
      status: "processing",
    });

    // ✅ DELIVERED ORDERS
    const deliveredOrders = await Order.countDocuments({
      status: "delivered",
    });

    // ❌ CANCELLED ORDERS
    const cancelledOrders = await Order.countDocuments({
      status: "cancelled",
    });

    // 💳 UNPAID ORDERS
    const unpaidOrders = await Order.countDocuments({
      paymentStatus: "unpaid",
    });

    // 💰 DEPOSIT PAID
    const depositPaidOrders = await Order.countDocuments({
      paymentStatus: "deposit_paid",
    });

    // ✅ FULLY PAID
    const fullyPaidOrders = await Order.countDocuments({
      paymentStatus: "fully_paid",
    });

    // ⭐ FEATURED CARS
    const featuredCars = await Car.countDocuments({
      featured: true,
    });

    // 🚗 AVAILABLE CARS
    const availableCars = await Car.countDocuments({
      availability: "available",
    });

    // ❌ SOLD CARS
    const soldCars = await Car.countDocuments({
      availability: "sold",
    });

    // 👨‍💼 ADMIN USERS
    const totalAdmins = await User.countDocuments({
      role: "admin",
    });

    // 👤 NORMAL USERS
    const totalNormalUsers = await User.countDocuments({
      role: "user",
    });

    // 🚫 BLOCKED USERS
    const blockedUsers = await User.countDocuments({
      isBlocked: true,
    });

    res.status(200).json({
      success: true,

      data: {
        totalUsers,
        totalAdmins,
        totalNormalUsers,
        blockedUsers,

        totalCars,
        featuredCars,
        availableCars,
        soldCars,

        totalOrders,
        pendingOrders,
        processingOrders,
        deliveredOrders,
        cancelledOrders,

        unpaidOrders,
        depositPaidOrders,
        fullyPaidOrders,

        totalBookings,

        totalRevenue,
      },
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};