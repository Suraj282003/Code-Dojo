module.exports = (req, res, next) => {
  // console.log("USER FROM TOKEN:", req.user); // 🔥 ADD THIS

  if (!req.user || req.user.role !== "admin") {
    return res.status(403).json({
      success: false,
      message: "Access denied: Admin only"
    });
  }

  next();
};