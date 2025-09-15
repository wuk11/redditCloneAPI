const { DataTypes } = require("sequelize");

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
    image: {
      type: DataTypes.STRING,
      allowNull: true,
      unique: false,
    },
    tag: {
      type: DataTypes.STRING,
      allowNull: true,
      unique: false,
    },
  },
  { timestamps: true }
);

module.exports = Article;
