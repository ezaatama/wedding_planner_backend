const { DataTypes } = require("sequelize");
const sequelize = require("../config/databases");

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
        }
    }, {
        freezeTableName: true,
        timestamps: true
    }
);

module.exports = Messages;