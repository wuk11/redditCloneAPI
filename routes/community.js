const express = require("express");

const communityController = require("../controllers/community");
const authMiddleware = require("../middleware/auth.js");

const router = express.Router();
const { body } = require("express-validator");

//community routes ~~~
router.post(
  "/",
  authMiddleware,
  [
    body("name")
      .isString()
      .withMessage("Name must be a string.")
      .isLength({ max: 20 })
      .withMessage("Community name can be at most 20 characters long."),
    body("description")
      .isString()
      .withMessage("Description must be a string.")
      .isLength({ max: 200 })
      .withMessage("Community description can be at most 200 characters long."),
  ],
  communityController.postCommunity
);

router.patch(
  "/changeRules/:id",
  authMiddleware,
  [
    body("rules")
      .isString()
      .withMessage("Rules must be a string.")
      .isLength({ max: 200 })
      .withMessage("Community rules can be at most 200 characters long."),
  ],
  communityController.changeRules
);

router.post("/ban/:id", authMiddleware, communityController.postBan);

router.post("/unBan/:id", authMiddleware, communityController.postUnBan);

router.get("/", communityController.getCommunities);

router.get("/canDelete/:id", authMiddleware, communityController.canDelete);

router.get("/canEdit/:id", authMiddleware, communityController.canEdit);

router.delete("/:id", authMiddleware, communityController.deleteCommunity);

//article routes ~~~
router.post(
  "/:id/article",
  authMiddleware,
  [
    body("title")
      .isString()
      .withMessage("Title must be a string.")
      .isLength({ max: 20 })
      .withMessage("Article title can be at most 20 characters long.")
      .trim()
      .notEmpty()
      .withMessage("Title cannot be empty or just spaces."),
    body("text")
      .isString()
      .withMessage("Description must be a string.")
      .isLength({ max: 200 })
      .withMessage("Article description can be at most 200 characters long.")
      .trim()
      .notEmpty()
      .withMessage("Article description cannot be empty or just spaces."),
    body("image")
      .optional({ nullable: true })
      .isString()
      .withMessage("Image source must be a string.")
      .isURL()
      .withMessage("Image source must be an URL.")
      .isLength({ max: 150 })
      .withMessage("Image source can be at most 150 characters long."),
    body("tags")
      .optional({ nullable: true })
      .isArray({ max: 3 })
      .withMessage("Tags must be an array with at most 3 items"),
    body("tags.*")
      .isString()
      .withMessage("Each tag must be a string.")
      .isLength({ min: 1, max: 15 })
      .withMessage("Tags must be between 1 and 15 characters long.")
      .trim()
      .notEmpty()
      .withMessage("Tag cannot be empty or just spaces."),
  ],
  communityController.postArticle
);

router.patch(
  "/articles/editTags/:id",
  [
    body("tags")
      .optional({ nullable: true })
      .isArray({ max: 3 })
      .withMessage("Tags must be an array with at most 3 items"),
    body("tags.*")
      .isString()
      .withMessage("Each tag must be a string.")
      .isLength({ min: 1, max: 15 })
      .withMessage("Tags must be between 1 and 15 characters long.")
      .trim()
      .notEmpty()
      .withMessage("Tag cannot be empty or just spaces."),
  ],
  authMiddleware,
  communityController.postEditTags
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

router.get("/:id/articles", communityController.getArticles);

router.get("/articles/:id", communityController.getArticle);

router.get("/randomArticles/", communityController.getRandomArticles);

router.delete(
  "/article/:id",
  authMiddleware,
  communityController.deleteArticle
);

module.exports = router;
