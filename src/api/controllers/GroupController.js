const PrismaService = require("../services/prisma/prisma.service");

class GroupController {
    constructor() {
        this.groups = new PrismaService().groups;
    }

    async findAll(_, res) {
        try {
            const allGroups = await this.groups.findMany({});
            return res.status(200).json(allGroups);
        } catch (error) {
            return res.status(500).json(error.message);
        }
    }
}

module.exports = GroupController;
