const { DataTypes } = require("sequelize");
const sequelize = require("../config/databases");
const Guests = require("./guests");
const Weddings = require("./weddings");

const Messages = sequelize.define(
    "messages", {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            allowNull: false,
            primaryKey: true,
        },
        message: {
            type: DataTypes.TEXT,
            allowNull: false,
        },
        wedding_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'weddings',
                key: 'id'
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

//ASOSIASI MESSAGES
Guests.hasOne(Messages, {
    foreignKey: 'guest_id',
    sourceKey: 'id',
    as: 'messages'
  });
  
Messages.belongsTo(Weddings, {
    foreignKey: 'wedding_id',
    targetKey: 'uuid',
    as: 'wedding'
});
  
Messages.belongsTo(Guests, {
    foreignKey: 'guest_id',
    targetKey: 'id',
    as: 'guest'
});

module.exports = Messages;