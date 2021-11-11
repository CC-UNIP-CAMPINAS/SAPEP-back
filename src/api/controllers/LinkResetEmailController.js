const dayjs = require("dayjs");
const utc = require("dayjs/plugin/utc");
const uuid = require("uuid");
const { errorCodes } = require("../config/express.config");
const sendMail = require("../services/mail/nodemailer");
const PrismaService = require("../services/prisma/prisma.service");

dayjs.extend(utc);

class LinkResetEmailController {
    constructor() {
        this.linkResetEmail = new PrismaService().linkResetEmail;
    }

    isExpire(date) {
        const now = dayjs.utc();
        const dateToCompare = dayjs.utc(date);
        return now.isAfter(dateToCompare);
    }

    async confirm(req, res) {
        try {
            const id = req.params.id;
            const linkReset = await this.linkResetEmail.findFirst({ where: { url: { contains: id } } });

            if (linkReset) {
                if (this.isExpire(linkReset.expire)) {
                    res.status(errorCodes.BAD_REQUEST).json({ message: "Link expirado." });
                } else {
                    await this.linkResetEmail.update({
                        where: { id: linkReset.id },
                        data: { User: { update: { email: linkReset.newEmail } } },
                    });
                    await this.linkResetEmail.delete({ where: { id: linkReset.id } });
                    res.clearCookie("sapep_token");
                    res.json({ message: "Email alterado com sucesso." });
                }
            } else {
                res.status(errorCodes.NOT_FOUND).json({ message: "Link inválido." });
            }
        } catch (error) {
            console.log(error);
            return res.status(errorCodes.INTERNAL_SERVER).json(error.message);
        }
    }

    async create(req, res) {
        try {
            const { newEmail } = req.body;
            const expire = dayjs.utc().add(1, "hour").toISOString();
            const url = `${process.env.FRONT_URL}/change-email/${uuid.v4()}`;
            const userId = req.idUser;

            const user = await new PrismaService().user.findUnique({ where: { email: newEmail } });

            if (user) return res.status(errorCodes.BAD_REQUEST).json({ message: "Email já cadastrado." });

            await this.linkResetEmail.upsert({
                where: { userId: req.idUser },
                create: { expire, newEmail, url, userId },
                update: { url, expire, newEmail },
            });
            await sendMail(newEmail, "SAPEP - Confirmar email.", url);
            res.json({ message: "Email de confirmação enviado." });
        } catch (error) {
            console.log(error);
            return res.status(errorCodes.INTERNAL_SERVER).json(error.message);
        }
    }
}

module.exports = LinkResetEmailController;
