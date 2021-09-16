const { hash, compare } = require("bcrypt");
const { errorCodes, statusTypes } = require("../config/express.config");
const PrismaService = require("../services/prisma/prisma.service");
const JwtController = require("./JwtController");

class UserController {
    constructor() {
        this.user = new PrismaService().user;
    }

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

    async findOne(email) {
        return this.user.findFirst({ where: { email } });
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

    async login(req, res) {
        try {
            const { email, password } = req.body;
            const user = await this.findOne(email);

            if (user) {
                if (await compare(password, user.password)) {
                    req.idUser = user.id;
                    const jwt = new JwtController();
                    await jwt.create(user.id);
                    return res.status(errorCodes.OK).json({ message: "Acesso permitido.", payload: true });
                } else {
                    return res.status(errorCodes.NOT_AUTHORIZED).json({ message: "Acesso negado.", payload: false });
                }
            } else {
                return res.status(errorCodes.NOT_FOUND).json({ message: "Usuário não encontrado." });
            }
        } catch (error) {
            return res.status(errorCodes.INTERNAL_SERVER).json({ message: error.message });
        }
    }

    removeSensitiveProperties(user) {
        delete user.password;
        return user;
    }
}

module.exports = UserController;
