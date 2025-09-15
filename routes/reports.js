const express = require("express");

const authMiddleware = require("../middleware/auth.js");
const reportsController = require("../controllers/reports.js");

const router = express.Router();

router.post(
  "/comment/:id",
  authMiddleware,
  reportsController.postReportComment
);

router.post(
  "/article/:id",
  authMiddleware,
  reportsController.postReportArticle
);

module.exports = router;
