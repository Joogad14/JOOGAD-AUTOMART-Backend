const Car = require("../models/Car");

// 🚗 ADD CAR
const addCar = async (req, res) => {
  try {
    const imageUrls = req.files
      ? req.files.map((file) => file.path)
      : [];

    const car = await Car.create({
      ...req.body,
      images: imageUrls,
      owner: req.user.id,
    });

    res.status(201).json({
      success: true,
      message: "Car added successfully",
      data: car,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// 🚗 GET ALL CARS
const getCars = async (req, res) => {
  try {
    let query = {};

    // 🔍 SEARCH
    if (req.query.search) {
      query.$or = [
        { name: { $regex: req.query.search, $options: "i" } },
        { brand: { $regex: req.query.search, $options: "i" } },
        { model: { $regex: req.query.search, $options: "i" } },
      ];
    }

    // 🚗 BRAND FILTER
    if (req.query.brand) {
      query.brand = req.query.brand;
    }

    // 🚗 CONDITION FILTER
    if (req.query.condition) {
      query.condition = req.query.condition;
    }

    // 🚗 YEAR FILTER
    if (req.query.year) {
      query.year = Number(req.query.year);
    }

    // 🚗 AVAILABILITY FILTER
    if (req.query.availability) {
      query.availability = req.query.availability;
    }

    // ⭐ FEATURED FILTER
    if (req.query.featured) {
      query.featured = req.query.featured === "true";
    }

    // 💰 PRICE FILTER
    if (req.query.minPrice || req.query.maxPrice) {
      query.price = {};

      if (req.query.minPrice) {
        query.price.$gte = Number(req.query.minPrice);
      }

      if (req.query.maxPrice) {
        query.price.$lte = Number(req.query.maxPrice);
      }
    }

    // 📊 SORTING
    let sortOption = { createdAt: -1 };

    if (req.query.sort === "price_asc") {
      sortOption = { price: 1 };
    }

    if (req.query.sort === "price_desc") {
      sortOption = { price: -1 };
    }

    // 📄 PAGINATION
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;

    const skip = (page - 1) * limit;

    const cars = await Car.find(query)
      .sort(sortOption)
      .skip(skip)
      .limit(limit)
      .populate("owner", "name email");

    const total = await Car.countDocuments(query);

    res.status(200).json({
      success: true,
      page,
      totalPages: Math.ceil(total / limit),
      totalCars: total,
      count: cars.length,
      data: cars,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// 🚗 GET SINGLE CAR
const getCarById = async (req, res) => {
  try {
    const car = await Car.findById(req.params.id)
      .populate("owner", "name email");

    if (!car) {
      return res.status(404).json({
        success: false,
        message: "Car not found",
      });
    }

    res.status(200).json({
      success: true,
      data: car,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ✏️ UPDATE CAR
const updateCar = async (req, res) => {
  try {
    const car = await Car.findById(req.params.id);

    if (!car) {
      return res.status(404).json({
        success: false,
        message: "Car not found",
      });
    }

    // ✅ UPDATE IMAGES IF NEW ONES ARE UPLOADED
    let imageUrls = car.images;

    if (req.files && req.files.length > 0) {
      imageUrls = req.files.map((file) => file.path);
    }

    const updatedCar = await Car.findByIdAndUpdate(
      req.params.id,
      {
        ...req.body,
        images: imageUrls,
      },
      {
        new: true,
      }
    );

    res.status(200).json({
      success: true,
      message: "Car updated successfully",
      data: updatedCar,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ❌ DELETE CAR
const deleteCar = async (req, res) => {
  try {
    const car = await Car.findById(req.params.id);

    if (!car) {
      return res.status(404).json({
        success: false,
        message: "Car not found",
      });
    }

    await car.deleteOne();

    res.status(200).json({
      success: true,
      message: "Car deleted successfully",
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  addCar,
  getCars,
  getCarById,
  updateCar,
  deleteCar,
};