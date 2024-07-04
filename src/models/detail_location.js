const { DataTypes } = require("sequelize");
const sequelize = require("../config/databases");

const DetailLocation = sequelize.define(
    "detail_location", {
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
        maps_akad: {
            type: DataTypes.STRING,
            validate: {
                notEmpty: true
            },
            allowNull: false
        },
        maps_resepsi: {
            type: DataTypes.STRING,
            validate: {
                notEmpty: true
            },
            allowNull: false
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
        indexes: [
            {
                unique: true,
                fields: ['id']
            }
        ]
    }
);

module.exports = DetailLocation;