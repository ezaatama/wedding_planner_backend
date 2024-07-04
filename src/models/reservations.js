const { DataTypes } = require("sequelize");
const sequelize = require("../config/databases");
const Guests = require("./guests");
const Weddings = require("./weddings");

const Reservations = sequelize.define(
    "reservations", {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            allowNull: false,
            primaryKey: true,
        },
        response: {
            type: DataTypes.ENUM("accepted", "declined"),
            allowNull: false,
        },
        wedding_id: {
            type: DataTypes.STRING,
            allowNull: false,
            references: {
                model: 'weddings',
                key: 'uuid'
            },
            onDelete: "CASCADE"
        },
        guest_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'guests',
                key: 'id'
            },
            onDelete: "CASCADE"
        },
        deletedAt: {
            type: DataTypes.DATE,
            allowNull: true,
        },
    }, {
        freezeTableName: true,
        timestamps: true,
        paranoid: true, // Aktifkan soft deletes
    }
);

//ASOSIASI RESERVATION
Guests.hasOne(Reservations, {
    foreignKey: 'guest_id',
    sourceKey: 'id',
    as: 'reservations'
  });
  
Reservations.belongsTo(Weddings, {
    foreignKey: 'wedding_id',
    targetKey: 'uuid',
    as: 'wedding'
});
  
Reservations.belongsTo(Guests, {
    foreignKey: 'guest_id',
    targetKey: 'id',
    as: 'guest'
});

module.exports = Reservations;