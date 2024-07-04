const { Sequelize } = require("sequelize");
const { mysql2 } = require("mysql2");

const sequelize = new Sequelize(
    "wedding_planner", "root", "", {
        host: "localhost",
        dialect: "mysql",
        dialectModule: mysql2,
    }
)

module.exports = sequelize;