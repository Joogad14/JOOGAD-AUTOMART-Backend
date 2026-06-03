const createReservation = async (req, res) => {
  try {
    const {
      name,
      email,
      phone,
      carModel,
      serviceType,
      date,
      time,
      message,
    } = req.body;

    // VALIDATION (IMPORTANT FOR PRODUCTION)
    if (!name || !email || !carModel) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields",
      });
    }

    const reservation = await Reservation.create({
      name,
      email,
      phone,
      carModel,
      serviceType,
      date,
      time,
      message,
    });

    
    // EMAIL TO USER
try {

   sendEmail({
    to: reservation.email,
    subject: "Reservation Submitted Successfully",
    text: `
Hello ${reservation.name},

Your reservation has been received successfully.

Car Model: ${reservation.carModel}
Service Type: ${reservation.serviceType}
Date: ${reservation.date}
Time: ${formatTime(reservation.time)}

Thank you for choosing JOOGAD AUTOMART.
    `,
  });

} catch (err) {

  console.log("USER EMAIL FAILED:", err.message);

}

    // EMAIL TO ADMIN
try {

  sendEmail({
    to: process.env.ADMIN_EMAIL,
    subject: "New Reservation Received",
    text: `
New reservation submitted.

Name: ${reservation.name}
Email: ${reservation.email}
Message: ${reservation.message}
      `,
  });

} catch (err) {

  console.log("ADMIN EMAIL FAILED:", err.message);

}
    res.status(201).json({
      success: true,
      reservation,
    });

  } catch (error) {
    console.log("RESERVATION ERROR:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  createReservation,
};