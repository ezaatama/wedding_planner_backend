const { DataTypes } = require("sequelize");
const sequelize = require("../config/databases");

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
        }
    }, {
        freezeTableName: true,
        timestamps: true
    }
);

module.exports = Reservations;