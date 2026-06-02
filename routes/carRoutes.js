const express = require("express");
const router = express.Router();

const upload = require("../middleware/uploadMiddleware");

const {
  addCar,
  getCars,
  getCarById,
  updateCar,
  deleteCar,
} = require("../controllers/carController");

const protect = require("../middleware/authMiddleware");
const admin = require("../middleware/adminMiddleware");

// 🌍 PUBLIC ROUTES
router.get("/", getCars);
router.get("/:id", getCarById);

// 🔐 ADMIN ROUTES
router.post(
  "/",
  protect,
  admin,
  upload.array("images", 5),
  addCar
);

router.put(
  "/:id",
  protect,
  admin,
  upload.array("images", 5),
  updateCar
);

router.delete(
  "/:id",
  protect,
  admin,
  deleteCar
);

module.exports = router;