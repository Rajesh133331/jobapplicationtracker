const db = require("../config/db");

const user = require("./user");
const onboard1 = require("./onboard1");
const onboard2 = require("./onboard2");
const education = require("./education");
const help = require("./help");
const application = require("./application");
const company = require("./company");
const savedjob = require("./savedjob");

db.sync();

module.exports = {
  db,
  user,
  onboard1,
  onboard2,
  education,
  help,
  application,
  company,
  savedjob,
};
