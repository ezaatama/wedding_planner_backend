const sequelize = require("./databases.js");
const Users = require("../models/users");
const Weddings = require("../models/weddings");
const Guests = require("../models/guests");
const Reservations = require("../models/reservations");
const Messages = require("../models/messages");
const Images = require("../models/images");
const AdminActions = require("../models/admin_actions");
const Designs = require("../models/designs");

//ASOSIASI USERS
Users.hasOne(Weddings, {
  foreignKey: 'user_id',
  sourceKey: 'uuid',
  as: 'wedding'
});

Weddings.belongsTo(Users, {
  foreignKey: 'user_id',
  targetKey: 'uuid',
  as: 'user'
});

//ASOSIASI WEDDINGS
Weddings.hasMany(Guests, {
  foreignKey: 'wedding_id',
  sourceKey: 'id',
  as: 'guests'
});

Guests.belongsTo(Weddings, {
  foreignKey: 'wedding_id',
  targetKey: 'id',
  as: 'wedding'
});

//ASOSIASI RESERVATION
Guests.hasOne(Reservations, {
  foreignKey: 'guest_id',
  sourceKey: 'id',
  as: 'reservations'
});

Reservations.belongsTo(Weddings, {
  foreignKey: 'wedding_id',
  targetKey: 'id',
  as: 'wedding'
});

Reservations.belongsTo(Guests, {
  foreignKey: 'guest_id',
  targetKey: 'id',
  as: 'guest'
});

//ASOSIASI MESSAGES
Guests.hasOne(Messages, {
  foreignKey: 'guest_id',
  sourceKey: 'id',
  as: 'messages'
});

Messages.belongsTo(Weddings, {
  foreignKey: 'wedding_id',
  targetKey: 'id',
  as: 'wedding'
});

Messages.belongsTo(Guests, {
  foreignKey: 'guest_id',
  targetKey: 'id',
  as: 'guest'
});

//ASOSIASI IMAGES
Weddings.hasMany(Images, {
  foreignKey: 'wedding_id',
  sourceKey: 'id',
  as: 'images'
});

Images.belongsTo(Weddings, {
  foreignKey: 'wedding_id',
  targetKey: 'id',
  as: 'wedding'
});

//ASOSIASI ADMIN ACTIONS
Users.hasMany(AdminActions, {
  foreignKey: 'admin_id',
  sourceKey: 'uuid',
  as: 'admin_action'
});

AdminActions.belongsTo(Users, {
  foreignKey: 'admin_id',
  targetKey: 'uuid',
  as: 'user'
});

//ASOSIASI DESIGNS
Weddings.hasOne(Designs, {
  foreignKey: 'wedding_id',
  sourceKey: 'id',
  as: 'design'
});

Designs.belongsTo(Weddings, {
  foreignKey: 'weeding_id',
  targetKey: 'id',
  as: 'wedding'
});

sequelize
  .sync({force: true})
  .then(() => {
    console.log("Database connected...");
    // User.sync({alter: true});
    // Guests.sync({force: true});
    // User.drop();
  })
  .catch((err) => {
    console.error(err);
  });

module.exports = { Users, Weddings, Guests, Reservations, Images, AdminActions, Designs };;