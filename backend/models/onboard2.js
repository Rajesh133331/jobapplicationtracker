const { DataTypes } = require("sequelize");
const db = require("../config/db");

const onboard2 = db.define("Onboards2data", {
  Email: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  Preferance: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

module.exports = onboard2;
