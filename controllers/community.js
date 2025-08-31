const Community = require("../models/community");
const Article = require("../models/article");
const Karma_history = require("../models/karma_history");
const communityRoles = require("../models/communityRoles");

exports.postCommunity = async (req, res, next) => {
  const { name, description } = req.body;

  try {
    const community = await Community.create({
      name,
      description,
      UserId: req.user.id,
    });
    await communityRoles.create({
      role: "owner",
      UserId: req.user.id,
      CommunityId: community.id,
    });

    res.json({ message: "Community successfully created." });
  } catch (err) {
    res.status(401).json({ error: "Error - cannot create community." });
  }
};

exports.getCommunities = async (req, res, next) => {
  try {
    const communities = await Community.findAll();
    if (!communities) {
      throw new Error("Server error - no communities found");
    }
    res.json({ communities: communities });
  } catch (err) {
    res.status(401).json({
      error: "Error - cannot fetch communities.",
      message: err.message,
    });
  }
};

exports.deleteCommunity = async (req, res, next) => {
  try {
    const id = req.params.id;

    const community = await Community.findByPk(id);
    if (!community) {
      throw new Error("No community found.");
    }
    if (community.UserId !== req.user.id) {
      throw new Error("Not authorized.");
    }
    community.destroy();
    res.json({ message: "Community deleted." });
  } catch (err) {
    res.status(401).json({
      error: "Error - cannot delete community.",
      message: err.message,
    });
  }
};

exports.postArticle = async (req, res, next) => {
  try {
    const { title, text, image, tag } = req.body;
    const article = await Article.create({
      title,
      text,
      image,
      tag,
      CommunityId: req.params.id,
      UserId: req.user.id,
    });
    const voteHistory = await Karma_history.create({
      UserId: req.user.id,
      ArticleId: article.id,
    });
    await article.increment("karma", { by: 1 });
    await voteHistory.update({ vote: 1 });
    res.json({ message: "Article created." });
  } catch (err) {
    res
      .status(401)
      .json({ error: "Error - cannot create article.", msg: err.message });
  }
};

exports.getArticles = async (req, res, next) => {
  try {
    const articles = await Article.findAll({
      where: { CommunityId: req.params.id },
    });
    res.json({ articles: articles });
  } catch (err) {
    res.status(401).json({
      error: "Error - cannot fetch articles.",
    });
  }
};

exports.getRandomArticles = async (req, res, next) => {
  try {
    const articles = await Article.findAll();
    res.json({ articles: articles });
  } catch (err) {
    res.status(401).json({
      error: "Error - cannot fetch the random articles.",
    });
  }
};

exports.getArticle = async (req, res, next) => {
  try {
    const article = await Article.findByPk(req.params.id);
    res.json({ article: article });
  } catch (err) {
    res.status(401).json({ error: "Error - cannot fetch article." });
  }
};

exports.deleteArticle = async (req, res, next) => {
  try {
    const id = req.params.id;
    const article = await Article.findByPk(id);
    if (!article) {
      throw new Error("No article found");
    }
    if (article.UserId !== req.user.id) {
      throw new Error("Not authorized");
    }
    article.destroy();
    res.json({ message: "Article deleted." });
  } catch (err) {
    res
      .status(401)
      .json({ error: "Error - cannot delete article.", message: err.message });
  }
};

exports.postArticleUpvote = async (req, res, next) => {
  try {
    const article = await Article.findByPk(req.params.id);
    if (!article) {
      throw new Error("Article not found.");
    }

    let voteHistory = await Karma_history.findOne({
      where: { ArticleId: article.id, UserId: req.user.id },
    });

    if (voteHistory === null) {
      voteHistory = await Karma_history.create({
        UserId: req.user.id,
        ArticleId: article.id,
      });
    }

    if (voteHistory.UserId === req.user.id && voteHistory.vote === 1) {
      throw new Error("Cannot upvote more than once.");
    } else if (voteHistory.UserId === req.user.id && voteHistory.vote === -1) {
      await article.increment("karma", { by: 2 });
    } else if (voteHistory.UserId === req.user.id && voteHistory.vote === 0) {
      //await article.update({ karma: article.karma + 1 });
      await article.increment("karma", { by: 1 });
    }

    await voteHistory.update({ vote: 1 });
    res.json({ message: "Article upvoted." });
  } catch (err) {
    res.status(401).json({
      error: "Error - cannot upvote article.",
      message: err.message,
    });
  }
};

exports.postArticleDownvote = async (req, res, next) => {
  try {
    const article = await Article.findByPk(req.params.id);
    if (!article) {
      throw new Error("Article not found.");
    }

    let voteHistory = await Karma_history.findOne({
      where: { ArticleId: article.id, UserId: req.user.id },
    });

    if (voteHistory === null) {
      voteHistory = await Karma_history.create({
        UserId: req.user.id,
        ArticleId: article.id,
      });
    }

    if (voteHistory.UserId === req.user.id && voteHistory.vote === -1) {
      throw new Error("Cannot downvote more than once.");
    } else if (voteHistory.UserId === req.user.id && voteHistory.vote === 1) {
      await article.increment("karma", { by: -2 });
    } else if (voteHistory.UserId === req.user.id && voteHistory.vote === 0) {
      //await article.update({ karma: article.karma - 1 });
      await article.increment("karma", { by: -1 });
    }

    await voteHistory.update({ vote: -1 });
    res.json({ message: "Article downvoted." });
  } catch (err) {
    res.status(401).json({
      error: "Error - cannot downvote article.",
      message: err.message,
    });
  }
};
