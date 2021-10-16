const { hash } = require("bcrypt");
const { errorCodes, statusTypes } = require("../../config/express.config");
const PrismaService = require("../../services/prisma/prisma.service");

class UserController {
    constructor() {
        this.user = new PrismaService().user;
    }

    userProperties = {
        name: true,
        email: true,
        gender: true,
        phone: true,
        updatedAt: true,
        email: true,
        groupId: true,
        id: true,
        createdAt: true,
        Doctor: true,
    };

    async findAll(_, res) {
        try {
            const allUsers = await this.user.findMany({
                select: { email: true, groupId: true, id: true, createdAt: true },
            });
            return res.status(errorCodes.OK).json(allUsers);
        } catch (error) {
            return res.status(errorCodes.INTERNAL_SERVER).json(error.message);
        }
    }

    async findAllByGroup(req, res) {
        try {
            const allUsers = await this.user.findMany({
                where: { groupId: +req.params.id },
                select: { email: true, groupId: true, id: true, createdAt: true },
            });
            return res.status(errorCodes.OK).json(allUsers);
        } catch (error) {
            return res.status(errorCodes.INTERNAL_SERVER).json(error.message);
        }
    }

    async findOne(email, isSensible) {
        if (isSensible) {
            return this.user.findFirst({
                where: { email },
                select: this.userProperties,
            });
        } else {
            return this.user.findFirst({
                where: { email },
                include: { Doctor: true },
            });
        }
    }

    async findOneById(id, isSensible) {
        if (isSensible) {
            return this.user.findUnique({
                where: { id },
                select: this.userProperties,
            });
        } else {
            return this.user.findUnique({
                where: { id },
                include: { Doctor: true },
            });
        }
    }

    async create(req, res) {
        try {
            const password = await hash(req.body.password, 12);
            const user = await this.user.create({ data: { ...req.body, password }, select: { email: true } });
            res.status(errorCodes.CREATED).json(user);
        } catch (error) {
            if (error.code === "P2002") {
                return res
                    .status(errorCodes.INTERNAL_SERVER)
                    .json({ status: statusTypes.UNIQUE_VIOLATION, message: "Usuário já existe" });
            }
            return res.status(errorCodes.INTERNAL_SERVER).json({ message: error.message });
        }
    }

    removeSensitiveProperties(user) {
        delete user.password;
        return user;
    }

    async findGroupByUserId(userId){
        return this.user.findUnique({
            where: {
                id: userId
            },
            select: {
                Groups: true
            }
        })
    }
}

module.exports = UserController;
