const { DataTypes } = require("sequelize");
const sequelize = require("../config/databases");
const Weddings = require("../models/weddings");

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
    }
);

//ASOSIASI IMAGES
Weddings.hasMany(Images, {
    foreignKey: 'wedding_id',
    sourceKey: 'uuid',
    as: 'images'
  });
  
Images.belongsTo(Weddings, {
    foreignKey: 'wedding_id',
    targetKey: 'uuid',
    as: 'wedding'
});

module.exports = Images;