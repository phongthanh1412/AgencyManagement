const authService = require("../services/auth.service");

exports.login = async (req, res) => {
  try {
    const { email, username, fullName, password } = req.body;
    const identifier = email || username || fullName;
    const result = await authService.login(identifier, password);
    res.json(result);
  } catch (error) {
    const status = error.message === "Invalid email, full name, or password" ? 401 : 500;
    res.status(status).json({ message: error.message });
  }
};

exports.register = async (req, res) => {
  try {
    const { fullName, email, password, role } = req.body;
    const result = await authService.register(fullName, email, password, role);
    res.status(201).json(result);
  } catch (error) {
    const status =
      error.message === "Missing required fields" ||
        error.message === "Invalid role" ||
        error.message === "Email already exists"
        ? 400
        : 500;
    res.status(status).json({ message: error.message });
  }
};
