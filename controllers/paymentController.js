const Order = require("../models/Order");
const paystack = require("../config/paystack");
const sendEmail = require("../utils/emailService");


// 💳 INITIALIZE PAYMENT (DEPOSIT)
exports.initializePayment = async (req, res) => {
  try {
    const order = await Order.findById(req.params.orderId).populate("user");

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    // ✅ Ensure deposit is a valid number
    const depositAmount = Number(order.depositAmount);

    if (!depositAmount || depositAmount <= 0) {
      return res.status(400).json({ message: "Invalid deposit amount" });
    }

    // ✅ Ensure user email exists
    if (!order.user?.email) {
      return res.status(400).json({ message: "User email is missing" });
    }

    // 💰 Convert to kobo
    const amountInKobo = depositAmount * 100;

    const response = await paystack.post("/transaction/initialize", {
      email: order.user.email,
      amount: amountInKobo,
      reference: `AUTOMART_${Date.now()}`,
      metadata: {
        orderId: order._id,
        type: "deposit_payment",
      },
    });

    const reference = response.data.data.reference;

    order.paymentReference = reference;
    await order.save();

    return res.json({
      success: true,
      authorization_url: response.data.data.authorization_url,
      reference,
      data: response.data.data,
    });

  } catch (err) {
    console.log("PAYSTACK ERROR:", err.response?.data || err.message);

    return res.status(500).json({
      success: false,
      message: err.response?.data?.message || err.message,
    });
  }
};


// ✅ VERIFY PAYMENT
exports.verifyPayment = async (req, res) => {
  try {
    const { reference } = req.params;

    const order = await Order.findOne({ paymentReference: reference }).populate("user");

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    const response = await paystack.get(`/transaction/verify/${reference}`);
    const paymentData = response.data.data;

    if (paymentData.status !== "success") {
      return res.status(400).json({ message: "Payment not successful" });
    }

    // ✅ Update order payment status
    order.paymentStatus = "deposit_paid";
    await order.save();

    // 🧮 Safe values
    const total = Number(order.amount || 0);
    const deposit = Number(order.depositAmount || 0);
    const balance = Number(order.balanceAmount || 0);

    // 📩 USER EMAIL
    await sendEmail(
      order.user.email,
      `🚗 Payment Successful - JOOGAD AUTOMART`,
      `
      <div style="font-family:Arial; background:#f4f6f8; padding:20px;">
        <div style="max-width:600px; margin:auto; background:#fff; padding:25px; border-radius:10px;">

          <h2 style="text-align:center; color:#2e7d32;">
            Hi ${order.user.name}, Payment Successful 🎉
          </h2>

          <p>Hello <b>${order.user.name}</b>,</p>

          <p>Your deposit has been successfully received.</p>

          <hr/>

          <h3>🧾 Order Details</h3>

          <p><b>Order ID:</b> ${order._id}</p>
          <p><b>Total:</b> ₦${total.toLocaleString()}</p>
          <p><b>Deposit Paid:</b> ₦${deposit.toLocaleString()}</p>
          <p><b>Balance:</b> ₦${balance.toLocaleString()}</p>

          <hr/>

          <p>Thank you for trusting <b>JOOGAD AUTOMART</b>, ${order.user.name} 🚗</p>

        </div>
      </div>
      `
    );

    // 📩 ADMIN EMAIL (SAFE CHECK)
    if (process.env.ADMIN_EMAIL) {
      await sendEmail(
        process.env.ADMIN_EMAIL,
        `💰 Deposit Received from ${order.user.name}`,
        `
        <div>
          <h2>Deposit Payment Alert</h2>

          <p><b>Customer:</b> ${order.user.name}</p>
          <p><b>Email:</b> ${order.user.email}</p>
          <p><b>Order:</b> ${order._id}</p>
          <p><b>Deposit:</b> ₦${deposit.toLocaleString()}</p>
        </div>
        `
      );
    }

    return res.json({
      success: true,
      message: "Payment verified successfully",
    });

  } catch (err) {
    console.log("VERIFY ERROR:", err.message);

    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};