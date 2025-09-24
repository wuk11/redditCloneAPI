const express = require("express");

const commentController = require("../controllers/comment.js");
const authMiddleware = require("../middleware/auth.js");

const router = express.Router();
const { body } = require("express-validator");

router.get("/:id", commentController.getComments);

router.post(
  "/:id",
  [
    body("text")
      .isString()
      .withMessage("Comment must be a string.")
      .isLength({ max: 200 })
      .withMessage("Comment can be at most 200 characters long.")
      .trim()
      .notEmpty()
      .withMessage("Comment cannot be empty or just spaces."),
  ],
  authMiddleware,
  commentController.postComment
);

router.post(
  "/reply/:id",
  [
    body("text")
      .isString()
      .withMessage("Comment must be a string.")
      .isLength({ max: 200 })
      .withMessage("Comment can be at most 200 characters long.")
      .trim()
      .notEmpty()
      .withMessage("Comment cannot be empty or just spaces."),
  ],
  authMiddleware,
  commentController.postReply
);

router.delete("/:id", authMiddleware, commentController.deleteComment);

router.post("/upvote/:id", authMiddleware, commentController.postCommentUpvote);

router.post(
  "/downvote/:id",
  authMiddleware,
  commentController.postCommentDownvote
);

module.exports = router;
