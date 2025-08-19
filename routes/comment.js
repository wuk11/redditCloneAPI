const express = require("express");

const commentController = require("../controllers/comment.js");
const authMiddleware = require("../middleware/auth.js");

const router = express.Router();

router.get("/:id", commentController.getComments);

router.post("/:id", authMiddleware, commentController.postComment);

router.post("/reply/:id", authMiddleware, commentController.postReply);

router.delete("/:id", authMiddleware, commentController.deleteComment);

router.post("/upvote/:id", authMiddleware, commentController.postCommentUpvote);

router.post(
  "/downvote/:id",
  authMiddleware,
  commentController.postCommentDownvote
);

module.exports = router;
