const { PrismaClient } = require("@prisma/client");

class PrismaService extends PrismaClient {
    async testConnection() {
        try {
            await this.$connect();
            console.log("Conexão com o banco de dados feita com sucesso!");
            this.$disconnect();
        } catch (error) {
            console.log("Problema para se conectar ao banco de dados: " + error);
        }
    }
}

module.exports = PrismaService;
