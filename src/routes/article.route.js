import express from "express";
import { createArticle, getArticles, getArticle, updateArticle, deleteArticle } from "../controllers/articleController.js";
import authMiddleware from "../middlewares/authMiddleware.js";
import { allowAdminOrEditor } from "../middlewares/roleMiddleware.js";

const router = express.Router();

// Create Article (admin/editor only)
router.post("/articles", authMiddleware, allowAdminOrEditor, createArticle);
// Update Article (admin/editor only)
router.put("/articles/:id", authMiddleware, allowAdminOrEditor, updateArticle);
// Delete Article (admin/editor only)
router.delete("/articles/:id", authMiddleware, allowAdminOrEditor, deleteArticle);
// Get All Articles
router.get("/articles", getArticles);
// Get Single Article
router.get("/articles/:id", getArticle);

export default router;