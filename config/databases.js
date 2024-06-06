const { Sequelize } = require("sequelize");

const sequelize = new Sequelize(
    "wedding_planner", "root", "", {
        host: "localhost",
        dialect: "mysql"
    }
)

module.exports = sequelize;