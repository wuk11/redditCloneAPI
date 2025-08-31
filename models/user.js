const { DataTypes } = require("sequelize");

const sequelize = require("../sequelize");

const User = sequelize.define(
  "User",
  {
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    image: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    global_role: {
      type: DataTypes.STRING,
      defaultValue: "user",
    },
  },
  { timestamps: true }
);

module.exports = User;
