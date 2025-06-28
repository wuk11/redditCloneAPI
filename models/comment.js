const { DataTypes } = require("sequelize");

const sequelize = require("../sequelize");

const Comment = sequelize.define(
  "Comment",
  {
    text: {
      type: DataTypes.TEXT,
      allowNull: false,
      unique: false,
    },
    karma: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: false,
      defaultValue: 0,
    },
    isDeleted: {
      type: DataTypes.BOOLEAN,
      default: false,
    },
  },
  { timestamps: true }
);

module.exports = Comment;
