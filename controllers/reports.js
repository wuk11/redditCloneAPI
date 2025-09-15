const Reports = require("../models/reports");

exports.postReportComment = async (req, res, next) => {
  try {
    const id = req.params.id;
    const reportReason = req.body.reportReason;
    await Reports.create({
      reason: reportReason,
      UserId: req.user.id,
      CommentId: id,
    });
    res.json({ message: "Reported comment successfully" });
  } catch (err) {
    res.status(401).json({
      error: "Error - cannot post report.",
      message: err.message,
    });
  }
};

exports.postReportArticle = async (req, res, next) => {
  try {
    const id = req.params.id;
    const reportReason = req.body.reportReason;
    await Reports.create({
      reason: reportReason,
      UserId: req.user.id,
      ArticleId: id,
    });
    res.json({ message: "Reported article successfully" });
  } catch (err) {
    res.status(401).json({
      error: "Error - cannot post report.",
      message: err.message,
    });
  }
};
