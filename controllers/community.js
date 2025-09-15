const Community = require("../models/community");
const Article = require("../models/article");
const Karma_history = require("../models/karma_history");
const communityRoles = require("../models/communityRoles");
const Ban_List = require("../models/ban_list");

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
    res.status(401).json({
      error: "Error - cannot create community.",
      message: err.message,
    });
  }
};

exports.postChangeRules = async (req, res, next) => {
  try {
    const { rules } = req.body;
    const id = req.params.id;

    const community = await Community.findByPk(id);
    if (!community) {
      throw new Error("No community found.");
    }
    const hasRole = await communityRoles.findAll({
      where: { UserId: req.user.id, CommunityId: community.id },
    });

    if (
      req.user.id == community.UserId ||
      req.user.global_role == "admin" ||
      hasRole.length > 0
    ) {
      community.rules = rules;
      await community.save();
      res.json({ message: "Community rules successfully changed." });
    } else {
      throw new Error("Not authorised.");
    }
  } catch (err) {
    res.status(401).json({
      error: "Error - cannot change community rules.",
      message: err.message,
    });
  }
};

exports.postBan = async (req, res, next) => {
  try {
    const communityId = req.params.id;
    const { bannedUserId } = req.body;

    const community = await Community.findByPk(communityId);
    if (!community) {
      throw new Error("No community found.");
    }
    const hasRole = await communityRoles.findAll({
      where: { UserId: req.user.id, CommunityId: community.id },
    });

    if (
      req.user.global_role === "admin" ||
      req.user.id == community.UserId ||
      hasRole.length > 0
    ) {
      await Ban_List.create({
        UserId: bannedUserId,
        bannedBy: req.user.id,
        CommunityId: community.id,
      });
    } else {
      throw new Error("Not authorised.");
    }
    res.json({ message: "User successfully banned." });
  } catch (err) {
    res.status(401).json({
      error: "Error - banning user failed.",
      message: err.message,
    });
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
      if (req.user.global_role !== "admin") {
        throw new Error("Not authorized.");
      }
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

    const community = await Community.findByPk(req.params.id);
    if (!community) {
      throw new Error("Cannot find community.");
    }
    const isbanned = await Ban_List.findAll({
      where: { UserId: req.user.id, CommunityId: community.id },
    });
    if (isbanned.length > 0) {
      throw new Error("You are banned.");
    }

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

    const community = await Community.findByPk(article.CommunityId);
    if (!community) {
      throw new Error("Community not found.");
    }
    const isbanned = await Ban_List.findAll({
      where: { UserId: req.user.id, CommunityId: community.id },
    });
    if (isbanned.length > 0) {
      throw new Error("You are banned.");
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

    const community = await Community.findByPk(article.CommunityId);
    if (!community) {
      throw new Error("Community not found.");
    }
    const isbanned = await Ban_List.findAll({
      where: { UserId: req.user.id, CommunityId: community.id },
    });
    if (isbanned.length > 0) {
      throw new Error("You are banned.");
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

exports.canDelete = async (req, res, next) => {
  try {
    const communityId = req.params.id;
    const community = await Community.findByPk(communityId);
    const userId = req.user.id;
    let permission = false;

    if (req.user.global_role === "admin" || community.UserId == userId) {
      permission = true;
    } else {
      permission = false;
    }

    res.json({ canDelete: permission });
  } catch (err) {
    res.status(401).json({
      error: "Error.",
      message: err.message,
    });
  }
};

exports.canEdit = async (req, res, next) => {
  try {
    const communityId = req.params.id;
    const community = await Community.findByPk(communityId);
    const userId = req.user.id;
    const hasRole = await communityRoles.findAll({
      where: { UserId: req.user.id, CommunityId: community.id },
    });
    let permission = false;

    if (
      req.user.global_role === "admin" ||
      community.UserId == userId ||
      hasRole.length > 0
    ) {
      permission = true;
    } else {
      permission = false;
    }

    res.json({ canEdit: permission });
  } catch (err) {
    res.status(401).json({
      error: "Error.",
      message: err.message,
    });
  }
};
