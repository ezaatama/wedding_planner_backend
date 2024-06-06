const { DataTypes } = require("sequelize");
const sequelize = require("../config/databases");

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
        }
    }, {
        freezeTableName: true,
        timestamps: true
    }
);

module.exports = Designs;