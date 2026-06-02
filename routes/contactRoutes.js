const express = require("express");
const router = express.Router();

const {
  createContact,
} = require("../controllers/contactController");

const protect = require("../middleware/authMiddleware");

// 📩 USER SEND MESSAGE
router.post("/", protect, createContact);

// console.log("createContact:", createContact);

module.exports = router;