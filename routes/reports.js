const express = require("express");

const authMiddleware = require("../middleware/auth.js");
const reportsController = require("../controllers/reports.js");

const router = express.Router();
const { body } = require("express-validator");

router.post(
  "/comment/:id",
  [
    body("reportReason")
      .isString()
      .withMessage("Report reason must be a string.")
      .isLength({ max: 50 })
      .withMessage("Report reason can be at most 50 characters long.")
      .trim()
      .notEmpty()
      .withMessage("Report reason cannot be empty or just spaces."),
  ],
  authMiddleware,
  reportsController.postReportComment
);

router.post(
  "/article/:id",
  [
    body("reportReason")
      .isString()
      .withMessage("Report reason must be a string.")
      .isLength({ max: 50 })
      .withMessage("Report reason can be at most 50 characters long.")
      .trim()
      .notEmpty()
      .withMessage("Report reason cannot be empty or just spaces."),
  ],
  authMiddleware,
  reportsController.postReportArticle
);

module.exports = router;
