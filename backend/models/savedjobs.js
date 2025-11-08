const { DataTypes } = require("sequelize");
const db = require("../config/db");

const savedjob = db.define("savedjobs", {
  Email: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  JobTitle: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  CompanyName: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  JobUrl: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  Notes: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
});

module.exports = savedjob;
