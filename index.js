require("dotenv/config");
const startApi = require("./src/api/config/express.config.js");
const sequelize = require("./src/api/services/sequelize/db.service")

startApi();
