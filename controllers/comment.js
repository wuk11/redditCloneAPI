const Article = require("../models/article");
const Comment = require("../models/comment");
const Karma_history = require("../models/karma_history");
const Community = require("../models/community");
const Ban_List = require("../models/ban_list");

const { validationResult } = require("express-validator");

exports.getComments = async (req, res, next) => {
  try {
    const id = req.params.id;
    const comments = await Comment.findAll({ where: { ArticleId: id } });
    res.json({ comments: comments });
  } catch (err) {
    res
      .status(401)
      .json({ error: "Error - cannot get comments.", message: err.message });
  }
};

exports.postComment = async (req, res, next) => {
  try {
    const id = req.params.id;
    const { text } = req.body;

    const validationErrors = validationResult(req);
    if (!validationErrors.isEmpty()) {
      throw new Error(validationErrors.array()[0].msg);
    }

    const article = await Article.findByPk(id);
    if (!article) {
      throw new Error("Cannot find post.");
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

    const comment = await Comment.create({
      text,
      UserId: req.user.id,
      ArticleId: article.id,
    });
    const voteHistory = await Karma_history.create({
      UserId: req.user.id,
      CommentId: comment.id,
    });
    await comment.increment("karma", { by: 1 });
    await voteHistory.update({ vote: 1 });
    res.json({ message: "comment posted." });
  } catch (err) {
    res
      .status(401)
      .json({ error: "Error - cannot create comment.", message: err.message });
  }
};

exports.postReply = async (req, res, next) => {
  try {
    const id = req.params.id;
    const { text } = req.body;

    const validationErrors = validationResult(req);
    if (!validationErrors.isEmpty()) {
      throw new Error(validationErrors.array()[0].msg);
    }

    const comment = await Comment.findByPk(id);
    if (!comment) {
      throw new Error("Cannot find comment.");
    }

    const article = await Article.findByPk(comment.ArticleId);
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

    const replyComment = await Comment.create({
      text,
      UserId: req.user.id,
      ArticleId: comment.ArticleId,
      replyToCommentId: id,
    });
    const voteHistory = await Karma_history.create({
      UserId: req.user.id,
      CommentId: replyComment.id,
    });
    await replyComment.increment("karma", { by: 1 });
    await voteHistory.update({ vote: 1 });
    res.json({ message: "comment posted." });
  } catch (err) {
    res.status(401).json({
      error: "Error - cannot create comment reply.",
      message: err.message,
    });
  }
};

exports.deleteComment = async (req, res, next) => {
  try {
    const id = req.params.id;
    const comment = await Comment.findByPk(id);
    if (!comment) {
      throw new Error("Cannot find comment.");
    }
    if (comment.UserId !== req.user.id) {
      throw new Error("Not authorized.");
    }
    comment.update({ isDeleted: true });
    res.json({ message: "comment deleted." });
  } catch (err) {
    res
      .status(401)
      .json({ error: "Error - cannot delete comment.", message: err.message });
  }
};

exports.postCommentUpvote = async (req, res, next) => {
  try {
    const comment = await Comment.findByPk(req.params.id);
    if (!comment) {
      throw new Error("Comment not found.");
    }

    const article = await Article.findByPk(comment.ArticleId);
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
      where: { CommentId: comment.id, UserId: req.user.id },
    });

    if (voteHistory === null) {
      voteHistory = await Karma_history.create({
        UserId: req.user.id,
        CommentId: comment.id,
      });
    }

    if (voteHistory.UserId === req.user.id && voteHistory.vote === 1) {
      throw new Error("Cannot upvote more than once.");
    } else if (voteHistory.UserId === req.user.id && voteHistory.vote === -1) {
      await comment.increment("karma", { by: 2 });
    } else if (voteHistory.UserId === req.user.id && voteHistory.vote === 0) {
      await comment.increment("karma", { by: 1 });
    }

    await voteHistory.update({ vote: 1 });
    res.json({ message: "Comment upvoted." });
  } catch (err) {
    res.status(401).json({
      error: "Error - cannot upvote comment.",
      message: err.message,
    });
  }
};

exports.postCommentDownvote = async (req, res, next) => {
  try {
    const comment = await Comment.findByPk(req.params.id);
    if (!comment) {
      throw new Error("Comment not found.");
    }

    const article = await Article.findByPk(comment.ArticleId);
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
      where: { CommentId: comment.id, UserId: req.user.id },
    });

    if (voteHistory === null) {
      voteHistory = await Karma_history.create({
        UserId: req.user.id,
        CommentId: comment.id,
      });
    }

    if (voteHistory.UserId === req.user.id && voteHistory.vote === -1) {
      throw new Error("Cannot downvote more than once.");
    } else if (voteHistory.UserId === req.user.id && voteHistory.vote === 1) {
      await comment.increment("karma", { by: -2 });
    } else if (voteHistory.UserId === req.user.id && voteHistory.vote === 0) {
      await comment.increment("karma", { by: -1 });
    }

    await voteHistory.update({ vote: -1 });
    res.json({ message: "Comment downvoted." });
  } catch (err) {
    res.status(401).json({
      error: "Error - cannot downvote comment.",
      message: err.message,
    });
  }
};
