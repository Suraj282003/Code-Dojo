// Get Logged-in User Profile
exports.getProfile = async (req, res) => {
  try {
    // req.user is set by auth middleware
    res.status(200).json({
      success: true,
      user: {
        id: req.user._id,
        name: req.user.name,
        email: req.user.email,
        rating: req.user.rating || 1200,
        rank: req.user.rank || "Bronze",
        wins: req.user.wins || 0,
        losses: req.user.losses || 0,
        draws: req.user.draws || 0,
        totalMatches: req.user.totalMatches || 0,
        role: req.user.role || "user",
        signUpAt: req.user.signUpAt,
      },
    });
  } catch (error) {
    console.error("Get Profile Error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};
