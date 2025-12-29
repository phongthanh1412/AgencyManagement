const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

class AuthService {
  async login(identifier, password) {
    const user = await User.findOne({
      $or: [{ email: identifier }, { fullName: identifier }]
    });
    if (!user) {
      throw new Error("Invalid email or password");
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      throw new Error("Invalid email, full name, or password");
    }

    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    return {
      token,
      user: {
        id: user._id,
        fullName: user.fullName,
        role: user.role
      }
    };
  }

  async register(fullName, email, password, role) {
    if (!fullName || !email || !password || !role) {
      throw new Error("Missing required fields");
    }

    if (!["admin", "staff"].includes(role)) {
      throw new Error("Invalid role");
    }

    const existing = await User.findOne({ email });
    if (existing) {
      throw new Error("Email already exists");
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const user = await User.create({
      fullName,
      email,
      passwordHash,
      role
    });

    return {
      id: user._id,
      fullName: user.fullName,
      email: user.email,
      role: user.role
    };
  }
}

module.exports = new AuthService();
