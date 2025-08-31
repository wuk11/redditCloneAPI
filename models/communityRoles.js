const { DataTypes } = require("sequelize");

const sequelize = require("../sequelize");

const communityRoles = sequelize.define(
  "communityRoles",
  {
    role: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  { timestamps: true }
);

module.exports = communityRoles;
