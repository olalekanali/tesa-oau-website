// Middleware to allow only organiser and admin roles
const allowOrganiserOrAdmin = (req, res, next) => {
  if (req.user && (req.user.role === "organiser" || req.user.role === "admin")) {
    return next();
  }
  return res.status(403).json({ message: "Access denied: Organiser or Admin only" });
};

export default allowOrganiserOrAdmin;
