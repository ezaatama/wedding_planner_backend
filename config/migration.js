const sequelize = require("./databases.js");
const User = require("../models/users");
const Wedding = require("../models/weddings");

const migrate = sequelize
  .authenticate()
  .then(() => {
    console.log("Database connected...");
    // User.sync({alter: true});
    User.sync({force: true});
    Wedding.sync({force: true});
    // User.drop();
  })
  .catch((err) => {
    console.error(err);
  });

module.exports = migrate;