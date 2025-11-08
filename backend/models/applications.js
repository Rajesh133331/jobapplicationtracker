const { DataTypes } = require("sequelize");
const db = require("../config/db");

const Application = db.define("applications", {
  Email: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  CompanyName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  JobTitle: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  ApplicationDate: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  ApplicationStatus: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  JobLocation: DataTypes.STRING,
  JobUrl: DataTypes.STRING,
  ResumeUrl: DataTypes.STRING,
  Notes: DataTypes.TEXT,
});

module.exports = Application;
