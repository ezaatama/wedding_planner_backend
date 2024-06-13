const { DataTypes } = require("sequelize");
const sequelize = require("../config/databases");

const MstTimeSchedule = sequelize.define(
    "mst_time_sch", {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            allowNull: false,
            primaryKey: true,
        },
        start_akad: {
            type: DataTypes.STRING,
        },
        end_akad: {
            type: DataTypes.STRING,
        },
        start_resepsi: {
            type: DataTypes.STRING,
        },
        end_resepsi: {
            type: DataTypes.STRING,
        },
        deletedAt: {
            type: DataTypes.DATE,
            allowNull: true,
        },
    },{
        freezeTableName: true,
        timestamps: true,
        paranoid: true, // Aktifkan soft deletes
    }
);

module.exports = MstTimeSchedule;