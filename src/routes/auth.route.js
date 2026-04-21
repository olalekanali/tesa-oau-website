import express from "express";
import { register, login } from "../controllers/authController.js";

const router = express.Router();

// GET Routes for pages
router.get("/login", (req, res) => {
  res.render("login", { title: "Login — TESA OAU" });
});

router.get("/register", (req, res) => {
  res.render("signup", { title: "Sign Up — TESA OAU" });
});

// POST Routes for authentication
// Register route
router.post("/register", register);
// Login route
router.post("/login", login);

export default router;
