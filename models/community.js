const { DataTypes } = require("sequelize");

const sequelize = require("../sequelize");

const Community = sequelize.define(
  "Community",
  {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    description: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: false,
    },
    rules: {
      type: DataTypes.STRING,
      allowNull: true,
      unique: false,
    },
  },
  { timestamps: true }
);

module.exports = Community;
