const { Sequelize } = require("sequelize");

const sequelize = new Sequelize(
    "wedding_planner", "root", "", {
        host: "localhost",
        dialect: "mysql",
        dialectModule: mysql2,
    }
)

module.exports = sequelize;