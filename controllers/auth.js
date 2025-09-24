const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

require("dotenv").config();
const User = require("../models/user");

const { validationResult } = require("express-validator");

exports.postSignup = async (req, res, next) => {
  try {
    const { username, password, email } = req.body;

    const validationErrors = validationResult(req);
    if (!validationErrors.isEmpty()) {
      throw new Error(validationErrors.array()[0].msg);
    }

    // hash the password and then create the user in the database
    const hashedPw = await bcrypt.hash(password, 10);
    await User.create({ email, username, password: hashedPw });
    res.json({ message: "User created successfully." });
  } catch (err) {
    res
      .status(401)
      .json({ error: "Registration failed", message: err.message });
  }
};

exports.postLogin = async (req, res, next) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ where: { username: username } });
    if (!user) {
      throw new Error("No user found!");
    }

    const isHashedPw = await bcrypt.compare(password, user.password);
    if (!isHashedPw) {
      throw new Error("Wrong username or password!");
    }

    const token = jwt.sign({ user: user }, process.env.SECRET, {
      expiresIn: "1h",
    });

    res.json({ token: token, expiresIn: "3600" });
  } catch (err) {
    res.status(401).json({ error: "Login failed", message: err.message });
  }
};
