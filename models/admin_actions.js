const { DataTypes } = require("sequelize");
const sequelize = require("../config/databases");

const AdminActions = sequelize.define(
    "admin_actions", {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            allowNull: false,
            primaryKey: true,
        },
        action_type: {
            type: DataTypes.STRING,
        },
        action_detail: {
            type: DataTypes.TEXT,
        },
        admin_id: { // Menambahkan kolom user_id sebagai foreign key
            type: DataTypes.STRING,
            allowNull: false,
            references: {
                model: 'users',
                key: 'uuid'
            },
            onDelete: "CASCADE"
        }
    }, {
        freezeTableName: true,
        timestamps: true
    }
);

module.exports = AdminActions;