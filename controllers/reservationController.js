const Reservation = require("../models/Reservation");
const sendEmail = require("../utils/emailService");

const formatTime = (time) => {

  let [hours, minutes] = time.split(":");

  hours = parseInt(hours);

  const ampm = hours >= 12 ? "PM" : "AM";

  hours = hours % 12;

  hours = hours ? hours : 12;

  return `${hours}:${minutes} ${ampm}`;
};

const createReservation = async (req, res) => {
  try {

    const reservation = await Reservation.create(req.body);

    // EMAIL TO USER
    await sendEmail({
      to: reservation.email,
      subject: "Reservation Submitted Successfully",
      text: `
Hello ${reservation.name},

Your reservation has been received successfully.

Car Model: ${reservation.carModel}
Service Type: ${reservation.serviceType}
Date: ${reservation.date}
Time: ${formatTime(reservation.time)}
Message: ${reservation.message}

A Customer Service Representative will respond to your enquiry within 24 hours. Thank you for choosing JOOGAD AUTOMART.
      `,
    });

    // EMAIL TO ADMIN
    await sendEmail({
      to: process.env.ADMIN_EMAIL,
      subject: "New Reservation Received",
      text: `
New reservation submitted.

Name: ${reservation.name}
Email: ${reservation.email}
Phone: ${reservation.phone}
Car: ${reservation.carModel}
Service: ${reservation.serviceType}
Date: ${reservation.date}
Time: ${reservation.time}
Message: ${reservation.message}
      `,
    });

    res.status(201).json({
      success: true,
      reservation,
    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  createReservation,
};