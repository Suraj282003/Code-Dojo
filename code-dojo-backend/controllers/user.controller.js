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
        level: req.user.level,
        battleCoins: req.user.battleCoins,
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
