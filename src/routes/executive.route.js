import express from "express";
import multer from "multer";
import path from "path";

import authMiddleware from "../middlewares/authMiddleware.js";
import allowAdminOnly from "../middlewares/adminOnlyMiddleware.js";

const router = express.Router();

// Set up multer storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/executives"); // folder to store images
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

const upload = multer({ storage });

import { createExecutive, getExecutives, getExecutive, updateExecutive, deleteExecutive } from "../controllers/executiveController.js";
// Get all executives
router.get("/executives", getExecutives);
// Get single executive
router.get("/executives/:id", getExecutive);
// Update executive (admin only, with image upload)
router.put("/executives/:id", authMiddleware, allowAdminOnly, upload.single("image"), updateExecutive);
// Delete executive (admin only)
router.delete("/executives/:id", authMiddleware, allowAdminOnly, deleteExecutive);




// Create Executive (admin only, with image upload)
router.post("/executives", authMiddleware, allowAdminOnly, upload.single("image"), createExecutive);

export default router;
