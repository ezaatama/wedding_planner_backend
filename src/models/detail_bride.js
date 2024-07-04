const { DataTypes } = require("sequelize");
const sequelize = require("../config/databases");

const DetailBride = sequelize.define(
    "detail_bride", {
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
        groom_to: {
            type: DataTypes.INTEGER,
        },
        bride_to: {
            type: DataTypes.INTEGER,
        },
        groom_parent: {
            type: DataTypes.STRING,
            validate: {
                notEmpty: true
            },
            allowNull: false
        },
        bride_parent: {
            type: DataTypes.STRING,
            validate: {
                notEmpty: true
            },
            allowNull: false
        },
        groom_no_rek: {
            type: DataTypes.STRING,
        },
        groom_name_rek: {
            type: DataTypes.STRING,
        },
        groom_bank_rek: {
            type: DataTypes.STRING,
        },
        bride_no_rek: {
            type: DataTypes.STRING,
        },
        bride_name_rek: {
            type: DataTypes.STRING,
        },
        bride_bank_rek: {
            type: DataTypes.STRING,
        },
        send_gift_address: {
            type: DataTypes.STRING,
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
    });

module.exports = DetailBride;