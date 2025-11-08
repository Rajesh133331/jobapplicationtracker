const { DataTypes } = require("sequelize");
const db = require("../config/db");

const company = db.define("companies", {
  Email: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  CompanyName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  ContactDetails: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  CompanySize: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  Industry: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  Notes: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
});

module.exports = company;
