import Article from "../models/article.model.js";
import User from "../models/user.js";

// Create Article
export const createArticle = async (req, res) => {
  try {
    // Only admin or editor can create
    if (!req.user || !["admin", "editor"].includes(req.user.role)) {
      return res.status(403).json({ message: "Access denied" });
    }
    const { featuredImage, title, description, text, tag } = req.body;
    const article = new Article({
      featuredImage,
      title,
      description,
      text,
      tag,
      author: req.user._id,
    });
    await article.save();
    res.status(201).json(article);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get All Articles
export const getArticles = async (req, res) => {
  try {
    const articles = await Article.find().populate("author", "username email");
    res.json(articles);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get Single Article
export const getArticle = async (req, res) => {
  try {
    const article = await Article.findById(req.params.id).populate("author", "username email");
    if (!article) return res.status(404).json({ message: "Article not found" });
    res.json(article);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update Article
export const updateArticle = async (req, res) => {
  try {
    // Only admin or editor can update
    if (!req.user || !["admin", "editor"].includes(req.user.role)) {
      return res.status(403).json({ message: "Access denied" });
    }
    const article = await Article.findById(req.params.id);
    if (!article) return res.status(404).json({ message: "Article not found" });
    const { featuredImage, title, description, text, tag } = req.body;
    if (featuredImage !== undefined) article.featuredImage = featuredImage;
    if (title !== undefined) article.title = title;
    if (description !== undefined) article.description = description;
    if (text !== undefined) article.text = text;
    if (tag !== undefined) article.tag = tag;
    await article.save();
    res.json(article);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete Article
export const deleteArticle = async (req, res) => {
  try {
    // Only admin or editor can delete
    if (!req.user || !["admin", "editor"].includes(req.user.role)) {
      return res.status(403).json({ message: "Access denied" });
    }
    const article = await Article.findByIdAndDelete(req.params.id);
    if (!article) return res.status(404).json({ message: "Article not found" });
    res.json({ message: "Article deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
