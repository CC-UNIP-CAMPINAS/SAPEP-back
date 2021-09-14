require("dotenv/config");
const { startApi } = require("./src/api/config/express.config.js");
const PrismaService = require("./src/api/services/prisma/prisma.service");

async function Main() {
    try {
        await startApi();
        await new PrismaService().testConnection();
    } catch (error) {
        console.log(error);
    }
}

Main();
