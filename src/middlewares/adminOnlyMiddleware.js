// Middleware to allow only admin role
const allowAdminOnly = (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    return next();
  }
  return res.status(403).json({ message: "Access denied: Admin only" });
};

export default allowAdminOnly;
