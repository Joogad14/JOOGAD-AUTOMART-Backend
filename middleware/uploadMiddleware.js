const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("../config/cloudinary");

// ☁️ CLOUDINARY STORAGE
const storage = new CloudinaryStorage({
  cloudinary,

  params: async (req, file) => ({
    folder: "automart-cars",

    allowed_formats: ["jpg", "jpeg", "png", "webp"],

    public_id: `${Date.now()}-${file.originalname}`,

    transformation: [
      {
        width: 1200,
        crop: "scale",
        quality: "auto",
      },
    ],
  }),
});

// 🚫 FILE FILTER
const fileFilter = (req, file, cb) => {
  const allowedTypes = [
    "image/jpeg",
    "image/png",
    "image/jpg",
    "image/webp",
  ];

  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Only image files are allowed"), false);
  }
};

// 🚀 MULTER CONFIG
const upload = multer({
  storage,
  fileFilter,

  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB
  },
});

module.exports = upload;