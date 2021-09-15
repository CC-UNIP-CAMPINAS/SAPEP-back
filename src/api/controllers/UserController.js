const { hash } = require("bcrypt");
const PrismaService = require("../services/prisma/prisma.service");

class UserController {
    constructor() {
        this.user = new PrismaService().user;
    }

    async findAll(_, res) {
        try {
            const allUsers = await this.user.findMany({});
            return res.status(200).json(allUsers);
        } catch (error) {
            return res.status(500).json(error.message);
        }
    }

    async create(req, res) {
        try {
            const password = await hash(req.body.password, 12);
            const user = await this.user.create({ data: { ...req.body, password } });
            res.send(200).json(user);
        } catch (error) {
            return res.status(500).json(error.message);
        }
    }
}

module.exports = UserController;
