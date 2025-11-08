const { DataTypes } = require("sequelize");
const db = require("../config/db");

const onboard1 = db.define("Onboards1data", {
  Email: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  Preferance: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

module.exports = onboard1;