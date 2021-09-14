require("dotenv/config");
const { startApi } = require("./src/api/config/express.config.js");

startApi();
