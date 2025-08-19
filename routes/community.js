const express = require("express");

const communityController = require("../controllers/community");
const authMiddleware = require("../middleware/auth.js");

const router = express.Router();

router.post("/", authMiddleware, communityController.postCommunity);

router.get("/", communityController.getCommunities);

router.delete("/:id", authMiddleware, communityController.deleteCommunity);

router.post("/:id/article", authMiddleware, communityController.postArticle);

router.get("/:id/articles", communityController.getArticles);

router.get("/articles/:id", communityController.getArticle);

router.delete(
  "/article/:id",
  authMiddleware,
  communityController.deleteArticle
);

router.post(
  "/article/:id/upvote",
  authMiddleware,
  communityController.postArticleUpvote
);

router.post(
  "/article/:id/downvote",
  authMiddleware,
  communityController.postArticleDownvote
);

module.exports = router;
