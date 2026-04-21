export const allowAdminOrEditor = (req, res, next) => {
  if (req.user && (req.user.role === "admin" || req.user.role === "editor")) {
    return next();
  }
  return res.status(403).json({ message: "Access denied" });
};