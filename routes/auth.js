const express = require("express");

const authController = require("../controllers/auth");

const router = express.Router();

const { body } = require("express-validator");

router.post(
  "/signup",
  [
    body("username")
      .isString()
      .withMessage("Username must be a string.")
      .isLength({ max: 20 })
      .withMessage("Username can be at most 20 characters long.")
      .trim()
      .notEmpty()
      .withMessage("Username cannot be empty or just spaces."),
    body("password")
      .isLength({ min: 8 })
      .withMessage("Password must be at least 8 characters long.")
      .isLength({ max: 40 })
      .withMessage("Password can be at most 40 characters long.")
      .trim()
      .notEmpty()
      .withMessage("Password cannot be empty or just spaces."),
    body("email")
      .isEmail()
      .withMessage("Email must be in an email format.")
      .isLength({ max: 40 })
      .withMessage("Email can be at most 40 characters long.")
      .trim()
      .notEmpty()
      .withMessage("Email cannot be empty or just spaces."),
  ],
  authController.postSignup
);

router.post("/login", authController.postLogin);

module.exports = router;
