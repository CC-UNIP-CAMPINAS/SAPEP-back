require("dotenv/config");
const { startApi } = require("./src/api/config/express.config.js");
const { testConnection } = require("./src/api/services/sequelize/db.service.js");

async function Main() {
    try {
        await startApi();
        await testConnection()
    } catch (error) {
        console.log(error);
    }
}

Main();
