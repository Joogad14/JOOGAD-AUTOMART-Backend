const sendEmail = require("../utils/emailService");
const Order = require("../models/Order");
const Car = require("../models/Car");

// 🛒 CREATE ORDER
exports.createOrder = async (req, res) => {
  try {
    const { carId } = req.body;

    const car = await Car.findById(carId);

    if (!car) {
      return res.status(404).json({
        message: "Car not found",
      });
    }

    // 💰 FULL PRICE
    const fullPrice = car.price;

    // 💳 10% DEPOSIT
    const depositAmount = Math.round(fullPrice * 0.1);

    // 💵 BALANCE
    const balanceAmount = fullPrice - depositAmount;

    // 🚗 CREATE ORDER
    const order = await Order.create({
      user: req.user.id,
      car: car._id,
      amount: fullPrice,
      depositAmount,
      balanceAmount,
      paymentMethod: "bank_transfer",
      paymentStatus: "unpaid",
    });

    // 📩 USER EMAIL
    await sendEmail(
      req.user.email,
      `🚗 Order Confirmed - JOOGAD AUTOMART`,
      `
      <div style="font-family:Arial,sans-serif;background:#f4f6f8;padding:20px;">
        <div style="max-width:600px;margin:auto;background:#fff;padding:25px;border-radius:10px;">

          <h2 style="text-align:center;color:#111;">
            Hi ${req.user.name}, Your Order Has Been Created ✅
          </h2>

          <p>Hello <b>${req.user.name}</b>,</p>

          <p>
            Thank you for choosing <b>JOOGAD AUTOMART</b>.
            Your order has been successfully placed.
          </p>

          <hr style="margin:20px 0;" />

          <h3>🚗 Vehicle Information</h3>

          <p><b>Vehicle:</b> ${car.name}</p>

          <hr style="margin:20px 0;" />

          <h3>💳 Payment Breakdown</h3>

          <p><b>Total Price:</b> ₦${fullPrice.toLocaleString()}</p>
          <p><b>Deposit Required (10%):</b> ₦${depositAmount.toLocaleString()}</p>
          <p><b>Remaining Balance:</b> ₦${balanceAmount.toLocaleString()}</p>

          <hr style="margin:20px 0;" />

          <h3>🏦 Bank Transfer Details</h3>

          <p><b>Bank:</b> OPay</p>
          <p><b>Account Name:</b> JOSHUA ADEYEMI OGUNSOLA</p>
          <p><b>Account Number:</b> 7048079078</p>

          <hr style="margin:20px 0;" />

          <p style="color:#555;">
            After payment, kindly upload your payment proof from your dashboard
            for verification.
          </p>

          <p>
            Thank you, <b>${req.user.name}</b> 🚗
          </p>

        </div>
      </div>
      `
    );

    // 📩 ADMIN EMAIL
    await sendEmail(
      process.env.ADMIN_EMAIL,
      `🚨 New Vehicle Order - ${req.user.name}`,
      `
      <div style="font-family:Arial,sans-serif;background:#f4f6f8;padding:20px;">
        <div style="max-width:600px;margin:auto;background:#fff;padding:25px;border-radius:10px;">

          <h2>New Vehicle Order 🚗</h2>

          <p>A customer has placed a new order.</p>

          <hr style="margin:20px 0;" />

          <h3>👤 Customer Information</h3>

          <p><b>Name:</b> ${req.user.name}</p>
          <p><b>Email:</b> ${req.user.email}</p>

          <hr style="margin:20px 0;" />

          <h3>🚗 Order Information</h3>

          <p><b>Vehicle:</b> ${car.name}</p>
          <p><b>Total Price:</b> ₦${fullPrice.toLocaleString()}</p>
          <p><b>Deposit:</b> ₦${depositAmount.toLocaleString()}</p>

        </div>
      </div>
      `
    );

    return res.status(201).json({
      success: true,
      message: "Order created successfully",
      data: order,
    });

  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

// 📦 GET USER ORDERS
exports.getUserOrders = async (req, res) => {
  try {
    const orders = await Order.find({
      user: req.user.id,
    })
      .populate("car")
      .sort({ createdAt: -1 });

    return res.json({
      success: true,
      count: orders.length,
      data: orders,
    });

  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

// 📦 GET ALL ORDERS (ADMIN)
exports.getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("user", "name email")
      .populate("car")
      .sort({ createdAt: -1 });

    return res.json({
      success: true,
      count: orders.length,
      data: orders,
    });

  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

// 📤 UPLOAD PAYMENT PROOF
exports.uploadPaymentProof = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        message: "Order not found",
      });
    }

    order.paymentProof = req.body.paymentProof;
    order.paymentStatus = "pending_verification";

    await order.save();

    return res.json({
      success: true,
      message: "Payment proof uploaded successfully",
      data: order,
    });

  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

// ✅ CONFIRM PAYMENT (ADMIN)
exports.confirmPayment = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate("user")
      .populate("car");

    if (!order) {
      return res.status(404).json({
        message: "Order not found",
      });
    }

    order.paymentStatus = "deposit_paid";
    order.status = "processing";

    await order.save();

    // 📩 USER EMAIL
    await sendEmail(
      order.user.email,
      `✅ Deposit Confirmed - JOOGAD AUTOMART`,
      `
      <div style="font-family:Arial;background:#f4f6f8;padding:20px;">
        <div style="max-width:600px;margin:auto;background:#fff;padding:25px;border-radius:10px;">

          <h2 style="color:#2e7d32;text-align:center;">
            Hi ${order.user.name}, Deposit Confirmed 🎉
          </h2>

          <p>Hello <b>${order.user.name}</b>,</p>

          <p>
            Your deposit payment has been successfully verified.
          </p>

          <hr style="margin:20px 0;" />

          <h3>🚗 Vehicle</h3>

          <p><b>${order.car.name}</b></p>

          <hr style="margin:20px 0;" />

          <h3>💳 Payment Summary</h3>

          <p><b>Total:</b> ₦${order.amount.toLocaleString()}</p>
          <p><b>Deposit Paid:</b> ₦${order.depositAmount.toLocaleString()}</p>
          <p><b>Balance Remaining:</b> ₦${order.balanceAmount.toLocaleString()}</p>

          <hr style="margin:20px 0;" />

          <p>
            Your order is now being processed.
          </p>

        </div>
      </div>
      `
    );

    return res.json({
      success: true,
      message: "Payment confirmed successfully",
      data: order,
    });

  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

// ✏️ UPDATE ORDER
exports.updateOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        message: "Order not found",
      });
    }

    Object.assign(order, req.body);

    await order.save();

    return res.json({
      success: true,
      message: "Order updated successfully",
      data: order,
    });

  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

// ❌ DELETE ORDER
exports.deleteOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        message: "Order not found",
      });
    }

    await order.deleteOne();

    return res.json({
      success: true,
      message: "Order deleted successfully",
    });

  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};