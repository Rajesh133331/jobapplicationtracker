const { DataTypes } = require("sequelize");
const db = require("../config/db");

const User = db.define("users", {
  Name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  Email: {
    type: DataTypes.STRING,
    allowNull: false,
    primaryKey: true,
  },
  Password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  Mobilenumber: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  Onboard: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
});

module.exports = User;
