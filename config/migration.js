const sequelize = require("./databases.js");
const Users = require("../models/users");
const Weddings = require("../models/weddings");
const Guests = require("../models/guests");
const Reservations = require("../models/reservations");
const Messages = require("../models/messages");
const Images = require("../models/images");
const AdminActions = require("../models/admin_actions");
const Designs = require("../models/designs");
const DetailBride = require("../models/detail_bride.js");
const DetailLocation = require("../models/detail_location.js");












sequelize
  .sync()
  .then(() => {
    console.log("Database connected...");
    // Users.sync({alter: true});
    // Guests.sync({alter: true});
    // User.drop();
  })
  .catch((err) => {
    console.error(err);
  });

module.exports = { Users, Weddings, Guests, Reservations, Images, AdminActions, Designs, Messages, DetailBride, DetailLocation };