const sequelize = require("./models/index").sequelize;

async function testConnection() {
    try {
        await sequelize.authenticate();
        console.log("Conexão com o banco de dados feita com sucesso!");
    } catch (error) {
        console.error("Erro ao tentar se conectar ao banco de dados:", error);
    }
}

module.exports = { testConnection, sequelize };
