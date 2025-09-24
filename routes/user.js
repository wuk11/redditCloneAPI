const express = require("express");

const userController = require("../controllers/user.js");
const authMiddleware = require("../middleware/auth.js");

const router = express.Router();

const { body } = require("express-validator");

router.patch(
  "/changePassword",
  [
    body("newPass")
      .isLength({ min: 8 })
      .withMessage("Password must be at least 8 characters long.")
      .isLength({ max: 40 })
      .withMessage("Password can be at most 40 characters long.")
      .trim()
      .notEmpty()
      .withMessage("Password cannot be empty or just spaces."),
  ],
  authMiddleware,
  userController.postChangePassword
);

router.patch(
  "/changeUsername",
  [
    body("username")
      .isString()
      .withMessage("Username must be a string.")
      .isLength({ max: 20 })
      .withMessage("Username can be at most 20 characters long.")
      .trim()
      .notEmpty()
      .withMessage("Username cannot be empty or just spaces."),
  ],
  authMiddleware,
  userController.postChangeUsername
);

router.patch(
  "/changeDisplayName",
  [
    body("displayName")
      .isString()
      .withMessage("Display name must be a string.")
      .isLength({ max: 20 })
      .withMessage("Display name can be at most 20 characters long.")
      .trim()
      .notEmpty()
      .withMessage("Display name cannot be empty or just spaces."),
  ],
  authMiddleware,
  userController.postChangeDisplayName
);

router.patch(
  "/changeDescription",
  [
    body("description")
      .isString()
      .withMessage("Description must be a string.")
      .isLength({ max: 200 })
      .withMessage("Community description can be at most 200 characters long."),
  ],
  authMiddleware,
  userController.postChangeDescription
);

router.patch(
  "/changeImage",
  [
    body("image")
      .isString()
      .withMessage("Image source must be a string.")
      .isURL()
      .withMessage("Image source must be an URL.")
      .isLength({ max: 150 })
      .withMessage("Image source can be at most 150 characters long."),
  ],
  authMiddleware,
  userController.postChangeImage
);

router.get("/me", authMiddleware, userController.getMe);

router.get("/:id/karma", authMiddleware, userController.getKarma);

router.get("/:id", userController.getUser);

module.exports = router;
