const bcrypt = require("bcrypt");

require("dotenv").config();
const User = require("../models/user");
const Article = require("../models/article");

exports.postChangePassword = async (req, res, next) => {
  try {
    const oldPass = req.body.oldPass;
    const newPass = req.body.newPass;

    const isHashedPw = await bcrypt.compare(oldPass, req.user.password);
    if (!isHashedPw) {
      throw new Error("Current password doesnt match");
    } else {
      const newHashedPass = await bcrypt.hash(newPass, 10);
      const user = await User.findByPk(req.user.id);
      await user.update({ password: newHashedPass });
      res.json({ message: "Password changed." });
    }
  } catch (err) {
    res
      .status(401)
      .json({ error: "Password change error", message: err.message });
  }
};

exports.postChangeUsername = async (req, res, next) => {
  try {
    const newUsername = req.body.newUsername;

    const isUsernameTaken = await User.findOne({
      where: { username: newUsername },
    });
    if (isUsernameTaken) {
      throw new Error("Username already taken");
    } else {
      const user = await User.findByPk(req.user.id);
      await user.update({ username: newUsername });
      res.json({ message: "Username changed." });
    }
  } catch (err) {
    res
      .status(401)
      .json({ error: "Username change error", message: err.message });
  }
};

exports.postChangeDescription = async (req, res, next) => {
  try {
    const newDescription = req.body.newDescription;

    const user = await User.findByPk(req.user.id);
    if (!user) {
      throw new Error("No user found.");
    }
    await user.update({ description: newDescription });
    res.json({ message: "description changed" });
  } catch (err) {
    res
      .status(401)
      .json({ error: "Username change error", message: err.message });
  }
};

exports.getKarma = async (req, res, next) => {
  try {
    const id = req.params.id;
    const user = await User.findByPk(id);
    if (!user) {
      throw new Error("Cannot find user");
    } else {
      const articles = await Article.findAll({ where: { UserId: id } });
      let karma = 0;
      for (let i = 0; i < articles.length; i++) {
        karma += articles[i].karma;
      }
      res.json({ totalKarma: karma });
    }
  } catch (err) {
    res.status(401).json({ error: "Cannot fetch karma", message: err.message });
  }
};

exports.getUser = async (req, res, next) => {
  try {
    const id = req.params.id;
    const user = await User.findByPk(id);
    if (!user) {
      throw new Error("Cannot find user");
    } else {
      res.json({ username: user.username });
    }
  } catch (err) {
    res.status(401).json({ error: "Cannot fetch user", message: err.message });
  }
};
