const PrismaService = require("../services/prisma/prisma.service");

class GroupController {
    constructor() {
        this.group = new PrismaService().group;
    }

    async findAll(_, res) {
        try {
            const allGroups = await this.group.findMany();
            return res.status(200).json(allGroups);
        } catch (error) {
            return res.status(500).json(error.message);
        }
    }
}

module.exports = GroupController;
