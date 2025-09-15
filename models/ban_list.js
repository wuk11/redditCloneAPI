const { DataTypes } = require("sequelize");

const sequelize = require("../sequelize");

const Ban_list = sequelize.define(
  "Ban_list",
  {
    UserId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  { timestamps: true }
);

module.exports = Ban_list;
