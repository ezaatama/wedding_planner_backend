const { DataTypes } = require("sequelize");
const sequelize = require("../config/databases");

const Users = sequelize.define(
    "users", {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            allowNull: false,
            unique: true,
            primaryKey: false,
        },
        uuid: {
            type: DataTypes.STRING,
            defaultValue: DataTypes.UUIDV4,
            allowNull: false,
            primaryKey: true,
            validate: {
                notEmpty: true
            },
        },
        username: {
            type: DataTypes.STRING,
            validate: {
                notEmpty: true
            },
            allowNull: false
        },
        email: {
            type: DataTypes.STRING,
            unique: true,
            validate: {
              notEmpty: true,
              isEmail: true,
            },
            allowNull: false,
        },
        password: {
            type: DataTypes.STRING,
            validate: {
                notEmpty: true
            },
            allowNull: false
        },
        full_name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        phone: {
            type: DataTypes.STRING,
            allowNull: false
        },
        role: {
            type: DataTypes.ENUM("admin", "user"),
            allowNull: false,
        },
    }, {
        freezeTableName: true,
        timestamps: true,
        indexes: [
            {
                unique: true,
                fields: ['id']
            }
        ]
    }
);

module.exports = Users;