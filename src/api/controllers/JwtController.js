const PrismaService = require("../services/prisma/prisma.service");
const { errorCodes, statusTypes } = require("../config/express.config");
const jwt = require("jsonwebtoken");

class JwtController {
    constructor() {
        this.jwt = new PrismaService().jwt;
    }

    async findAll(_, res) {
        try {
            const allJwts = await this.jwt.findMany({});
            return res.status(errorCodes.OK).json(allJwts);
        } catch (error) {
            return res.status(errorCodes.INTERNAL_SERVER).json(error.message);
        }
    }

    async create(idUser) {
        try {
            const token = jwt.sign({}, process.env.JWT_KEY, {
                expiresIn: "5h", // expires in 5 hours
            });
            const dayjs = require("dayjs");

            return await this.jwt.create({ data: { token, expire: dayjs().add(5, "hours").toDate(), idUser } });
        } catch (error) {
            if (error.code === "P2002") {
                await this.delete(idUser);
                return this.create(idUser);
            }

            throw error;
        }
    }

    async delete(idUser) {
        return this.jwt.delete({ where: { idUser } });
    }
}

module.exports = JwtController;
