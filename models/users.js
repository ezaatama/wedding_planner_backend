const { DataTypes } = require("sequelize");
const sequelize = require("../config/databases");
const Weddings = require("../models/weddings");

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
        deletedAt: {
            type: DataTypes.DATE,
            allowNull: true,
        },
    }, {
        freezeTableName: true,
        timestamps: true,
        paranoid: true, // Aktifkan soft deletes
        indexes: [
            {
                unique: true,
                fields: ['id']
            }
        ]
    }
);

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

module.exports = Users;