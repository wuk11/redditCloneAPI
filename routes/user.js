const express = require("express");

const userController = require("../controllers/user.js");
const authMiddleware = require("../middleware/auth.js");

const router = express.Router();

router.post(
  "/changePassword",
  authMiddleware,
  userController.postChangePassword
);

router.post(
  "/changeUsername",
  authMiddleware,
  userController.postChangeUsername
);

router.post(
  "/changeDisplayName",
  authMiddleware,
  userController.postChangeDisplayName
);

router.post(
  "/changeDescription",
  authMiddleware,
  userController.postChangeDescription
);

router.post("/changeImage", authMiddleware, userController.postChangeImage);

router.get("/me", authMiddleware, userController.getMe);

router.get("/:id/karma", authMiddleware, userController.getKarma);

router.get("/:id", userController.getUser);

module.exports = router;
