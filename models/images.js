const { DataTypes } = require("sequelize");
const sequelize = require("../config/databases");

const Images = sequelize.define(
    "images", {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            allowNull: false,
            primaryKey: true,
        },
        image_url: {
            type: DataTypes.TEXT,
        },
        description: {
            type: DataTypes.STRING,
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
    }
);

module.exports = Images;