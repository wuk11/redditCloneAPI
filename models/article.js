const { DataTypes, Sequelize } = require("sequelize");

const sequelize = require("../sequelize");

const Article = sequelize.define(
  "Article",
  {
    title: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: false,
    },
    text: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: false,
    },
    karma: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: false,
      defaultValue: 0,
    },
  },
  { timestamps: true }
);

module.exports = Article;
