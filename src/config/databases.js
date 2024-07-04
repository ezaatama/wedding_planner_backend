const { Sequelize } = require("sequelize");
import mysql2 from 'mysql2';

const sequelize = new Sequelize(
    "wedding_planner", "root", "", {
        host: "localhost",
        dialect: "mysql",
        dialectModule: mysql2,
    }
)

module.exports = sequelize;