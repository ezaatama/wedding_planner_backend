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
            type: DataTypes.STRING,
            allowNull: false,
            references: {
                model: 'weddings',
                key: 'uuid'
            },
            onDelete: "CASCADE"
        },
        deletedAt: {
            type: DataTypes.DATE,
            allowNull: true,
        },
    },{
        freezeTableName: true,
        timestamps: true,
        paranoid: true, // Aktifkan soft deletes
    }
);

module.exports = Guests;