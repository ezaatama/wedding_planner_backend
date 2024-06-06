const { DataTypes } = require("sequelize");
const sequelize = require("../config/databases");

const Weddings = sequelize.define(
    "weddings", {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            allowNull: false,
            primaryKey: true,
        },
        groom_name: {
            type: DataTypes.STRING,
            validate: {
                notEmpty: true
            },
            allowNull: false
        },
        bride_name: {
            type: DataTypes.STRING,
            validate: {
                notEmpty: true
            },
            allowNull: false
        },
        wedding_date: {
            type: DataTypes.DATE,
            validate: {
                notEmpty: true
            },
            allowNull: false
        },
        venue: {
            type: DataTypes.STRING,
            validate: {
                notEmpty: true
            },
            allowNull: false
        },
        address: {
            type: DataTypes.TEXT,
            validate: {
                notEmpty: true
            },
            allowNull: false
        },
        user_id: { // Menambahkan kolom user_id sebagai foreign key
            type: DataTypes.STRING,
            allowNull: false,
            references: {
                model: 'users',
                key: 'uuid'
            },
            onDelete: "CASCADE"
        }
    },{
        freezeTableName: true,
        timestamps: true
    }
);

module.exports = Weddings;