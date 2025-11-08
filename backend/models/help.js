const { DataTypes } = require("sequelize");
const db = require("../config/db");

const education = db.define("education", {
  Education: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  Email: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

module.exports = education;
