const sequelize = require("./databases.js");
const Users = require("../models/users");
const Weddings = require("../models/weddings");
const Guests = require("../models/guests");
const Reservations = require("../models/reservations");
const Messages = require("../models/messages");
const Images = require("../models/images");
const AdminActions = require("../models/admin_actions");
const Designs = require("../models/designs");













sequelize
  .sync()
  .then(() => {
    console.log("Database connected...");
    // Users.sync({alter: true});
    // Guests.sync({force: true});
    // User.drop();
  })
  .catch((err) => {
    console.error(err);
  });

module.exports = { Users, Weddings, Guests, Reservations, Images, AdminActions, Designs, Messages };