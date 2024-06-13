const { DataTypes } = require("sequelize");
const sequelize = require("../config/databases");

const Weddings = sequelize.define(
    "weddings", {
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
            type: DataTypes.ENUM("aula", "gedung", "rumah"),
            allowNull: false
        },
        detail_venue: {
            type: DataTypes.STRING,
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
        },
        deletedAt: {
            type: DataTypes.DATE,
            allowNull: true,
        },
    },{
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

module.exports = Weddings;