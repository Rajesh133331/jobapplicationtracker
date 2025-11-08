const { Sequelize, DataTypes } = require("sequelize");

const db = new Sequelize("job", "root", "paruchurisivaprasad", {
  dialect: "mysql",
  host: "localhost",
});

db.authenticate()
  .then(() => {
    console.log("connected successfully");
  })
  .catch((err) => {
    console.log(err);
  });

db.sync();
