const express = require("express");
const router = express.Router();
const authController = require("../controllers/auth.controller");

// login
router.post("/login", authController.login);

// register
router.post("/register", authController.register);

module.exports = router;
