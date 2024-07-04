const { DataTypes } = require("sequelize");
const sequelize = require("../config/databases");
const Users = require("./users");

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

//ASOSIASI ADMIN ACTIONS
Users.hasMany(AdminActions, {
    foreignKey: 'admin_id',
    sourceKey: 'uuid',
    as: 'admin_action'
  });
  
AdminActions.belongsTo(Users, {
    foreignKey: 'admin_id',
    targetKey: 'uuid',
    as: 'user'
});

module.exports = AdminActions;