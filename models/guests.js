const { DataTypes } = require("sequelize");
const sequelize = require("../config/databases");

const Guests = sequelize.define(
    "guests", {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            allowNull: false,
            primaryKey: true,
        },
        guest_name: {
            type: DataTypes.STRING,
            validate: {
                notEmpty: true
            },
            allowNull: false
        },
        email: {
            type: DataTypes.STRING,
        },
        phone: {
            type: DataTypes.STRING,   
        },
        address: {
            type: DataTypes.STRING,   
        },
        rsvp_status: {
            type: DataTypes.ENUM("pending", "accepted", "declined"),
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
        }
    },{
        freezeTableName: true,
        timestamps: true
    }
);

module.exports = Guests;