const { DataTypes } = require("sequelize");

const sequelize = require("../sequelize");

const Reports = sequelize.define(
  "Reports",
  {
    reason: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
  },
  { timestamps: true }
);

module.exports = Reports;
