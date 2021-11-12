const dayjs = require("dayjs");
const utc = require("dayjs/plugin/utc");
const uuid = require("uuid");
const { errorCodes } = require("../config/express.config");
const sendMail = require("../services/mail/nodemailer");
const PrismaService = require("../services/prisma/prisma.service");
const { hash } = require("bcrypt");

dayjs.extend(utc);

class LinkResetPasswordController {
    constructor() {
        this.linkResetPassword = new PrismaService().linkResetPassword;
    }

    isExpire(date) {
        const now = dayjs.utc();
        const dateToCompare = dayjs.utc(date);
        return now.isAfter(dateToCompare);
    }

    async confirm(req, res) {
        try {
            const { newPassword } = req.body;
            const id = req.params.id;
            const linkReset = await this.linkResetPassword.findFirst({
                where: { url: { contains: id } },
            });

            if (linkReset) {
                if (this.isExpire(linkReset.expire)) {
                    res.status(errorCodes.BAD_REQUEST).json({ message: "Link expirado." });
                } else {
                    await this.linkResetPassword.update({
                        where: { id: linkReset.id },
                        data: { User: { update: { password: await hash(newPassword, 12) } } },
                    });
                    await this.linkResetPassword.delete({ where: { id: linkReset.id } });
                    res.clearCookie("sapep_token");
                    res.json({ message: "Senha alterada com sucesso." });
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
            const email = req.body.email;
            const expire = dayjs.utc().add(1, "hour").toISOString();
            const url = `${process.env.FRONT_URL}/change-password/${uuid.v4()}`;

            const user = await new PrismaService().user.findUnique({ where: { email } });

            if (!user) return res.status(errorCodes.NOT_FOUND).json({ message: "Usuário não encontrado." });

            await this.linkResetPassword.upsert({
                where: { userId: user.id },
                create: { expire, url, userId: user.id },
                update: { url, expire },
            });

            await sendMail(user.email, "SAPEP - Alterar senha.", url);
            res.json({ message: "Email de alteração enviado." });
        } catch (error) {
            console.log(error);
            return res.status(errorCodes.INTERNAL_SERVER).json(error.message);
        }
    }
}

module.exports = LinkResetPasswordController;
