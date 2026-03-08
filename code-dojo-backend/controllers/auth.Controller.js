const User = require("../models/users");
const redisClient = require("../config/redis");
const jwt = require("jsonwebtoken");
const { OAuth2Client } = require("google-auth-library");
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);


// SIGNUP

exports.signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // 1️⃣ Validate input
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    // 2️⃣ Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "User already exists",
      });
    }

    // 3️⃣ Create user
    const user = await User.create({ name, email, password });
    console.log("New user created:", user);

    // 4️⃣ Generate tokens (MATCHES YOUR MODEL)
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    // 5️⃣ Save refresh token in DB
    user.refreshToken = refreshToken;
    await user.save();

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",        // 🔥 ALLOW cross-port on localhost
      secure: false,          // 🔥 MUST be false on http
      path: "/",
    });

    // 6️⃣ Response
    res.status(201).json({
      success: true,
      accessToken,
      refreshToken,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        rating: user.rating || 1000,
        rank: user.rank || "Bronze",
        wins: user.wins || 0,
        losses: user.losses || 0,
        draws: user.draws || 0,
        totalMatches: user.totalMatches || 0,
        signUpAt: user.signUpAt,
      },
    });
  } catch (err) {
    console.error("Signup error:", err);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// LOGIN

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password required",
      });
    }

    const user = await User.findOne({ email }).select("+password");
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({
        success: false,
        message: "email or password is incorrect",
      });
    }

    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    user.refreshToken = refreshToken;
    await user.save();

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      sameSite: "lax",
      secure: false, // localhost only
      path: "/",
    });

    res.json({
      success: true,
      accessToken,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        rating: user.rating || 1000,
        rank: user.rank || "Bronze",
        wins: user.wins || 0,
        losses: user.losses || 0,
        draws: user.draws || 0,
        totalMatches: user.totalMatches || 0,
        signUpAt: user.signUpAt,
      },
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// LOGOUT

exports.logout = async (req, res) => {
  try {
    // req.user is guaranteed by `protect`
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Not authenticated",
      });
    }

    // ✅ Clear refresh token from DB
    req.user.refreshToken = null;
    await req.user.save();

    // ✅ Clear refresh token cookie
    res.clearCookie("refreshToken", {
      httpOnly: true,
      sameSite: "lax",
      secure: false, // true in production
      path: "/",
    });

    return res.status(200).json({
      success: true,
      message: "Logged out successfully",
    });
  } catch (error) {
    console.error("❌ LOGOUT ERROR:", error);
    return res.status(500).json({
      success: false,
      message: "Logout failed",
    });
  }
};


// REFRESH TOKEN

exports.refreshToken = async (req, res) => {

  //   console.log("🍪 cookies:", req.cookies);
  // console.log("📦 headers.cookie:", req.headers.cookie);

  // return res.status(200).json({ success: true });

  try {
    const token = req.cookies?.refreshToken;

    if (!token) {
      return res.status(401).json({ success: false, message: "No refresh token" });
    }

    const user = await User.findOne({ refreshToken: token });
    if (!user) {
      return res.status(403).json({ success: false, message: "Invalid refresh token" });
    }

    jwt.verify(token, process.env.JWT_REFRESH_SECRET, (err) => {
      if (err) {
        return res.status(403).json({ success: false, message: "Token expired" });
      }

      const newAccessToken = user.generateAccessToken();
      return res.json({ success: true, accessToken: newAccessToken });
    });

  } catch (err) {
    console.error("🔥 REFRESH TOKEN ERROR:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

exports.googleAuth = async (req, res) => {
  try {
    const { token } = req.body;

    if (!token) {
      return res.status(400).json({
        success: false,
        message: "Google token missing",
      });
    }

    // 1️⃣ Verify Google ID token
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    const { email, name } = payload;

    if (!email) {
      return res.status(400).json({ success: false });
    }

    // 2️⃣ Find or create user
    let user = await User.findOne({ email });

    if (!user) {
      user = await User.create({
        email,
        name,
        provider: "google",
      });
    }

    // 3️⃣ Generate tokens
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    user.refreshToken = refreshToken;
    await user.save();

    // 4️⃣ Set refresh cookie
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      sameSite: "lax",
      secure: false, // true in production
      path: "/",
    });

    // 5️⃣ Send access token
    return res.status(200).json({
      success: true,
      accessToken,
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
      },
    });
  } catch (error) {
    console.error("DETAILED GOOGLE AUTH ERROR:", error); // Change this!
    res.status(500).json({ success: false, message: error.message });
  }
};