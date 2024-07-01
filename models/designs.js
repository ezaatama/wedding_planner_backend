const { DataTypes } = require("sequelize");
const sequelize = require("../config/databases");
const Weddings = require("../models/weddings");

const Designs = sequelize.define(
    "designs", {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            allowNull: false,
            primaryKey: true,
        },
        template_name: {
            type: DataTypes.STRING,
            allowNull: false
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

//ASOSIASI DESIGNS
Weddings.hasOne(Designs, {
    foreignKey: 'wedding_id',
    sourceKey: 'uuid',
    as: 'design'
  });
  
Designs.belongsTo(Weddings, {
    foreignKey: 'wedding_id',
    targetKey: 'uuid',
    as: 'wedding'
});

module.exports = Designs;