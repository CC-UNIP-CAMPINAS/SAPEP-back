const PrismaService = require("../services/prisma/prisma.service");
const jwt = require("jsonwebtoken");

class JwtController {
    constructor() {
        this.jwt = new PrismaService().jwt;
    }

    async create(idUser) {
        const token = jwt.sign({}, process.env.JWT_KEY, {
            expiresIn: "5h", // expires in 5 hours
        });
        const dayjs = require("dayjs");

        return this.jwt.create({ data: { token, expire: dayjs().add(5, "hours").toDate(), idUser } });
    }
}

module.exports = JwtController;
