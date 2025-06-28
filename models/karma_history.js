const { DataTypes } = require("sequelize");

const sequelize = require("../sequelize");

const Karma_history = sequelize.define(
  "Karma_history",
  {
    vote: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
  },
  { timestamps: true }
);

module.exports = Karma_history;
