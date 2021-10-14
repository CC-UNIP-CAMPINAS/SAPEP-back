const { hash } = require("bcrypt");
const { errorCodes, statusTypes } = require("../../config/express.config");
const PrismaService = require("../../services/prisma/prisma.service");

class NurseController {
    constructor() {
        this.nurse = new PrismaService().nurse;
        this.user = new PrismaService().user;
    }

    nurseProperties = {
        coren: true,
        userId: true,
        user: {
            select: { email: true, gender: true, name: true, phone: true, groupId: true, updatedAt: true },
        },
    };

    async findAll(_, res) {
        try {
            const allNurses = await this.nurse.findMany({
                include: {
                    user: {
                        select: { updatedAt: true, email: true, gender: true, groupId: true, name: true, phone: true },
                    },
                },
            });
            return res.status(errorCodes.OK).json(allNurses);
        } catch (error) {
            return res.status(errorCodes.INTERNAL_SERVER).json(error.message);
        }
    }

    async findOneByCoren(req, res) {
        try {
            const nurse = await this.nurse.findUnique({
                where: { coren: req.body.coren },
                include: {
                    user: {
                        select: { updatedAt: true, email: true, gender: true, groupId: true, name: true, phone: true },
                    },
                },
            });
            return res.status(errorCodes.OK).json(nurse);
        } catch (error) {
            return res.status(errorCodes.INTERNAL_SERVER).json(error.message);
        }
    }

    async create(req, res) {
        try {
            const password = await hash(req.body.password, 12);
            const nurseParams = { coren: req.body.coren };
            const userParams = { ...req.body };
            delete userParams["coren"];

            const user = await this.nurse.create({
                data: { ...nurseParams, user: { create: { ...userParams, password, groupId: 2 } } },
                include: {
                    user: {
                        select: {
                            name: true,
                            email: true,
                            gender: true,
                            phone: true,
                            updatedAt: true,
                            email: true,
                            groupId: true,
                            id: true,
                            createdAt: true,
                        },
                    },
                },
            });
            res.status(errorCodes.CREATED).json(user);
        } catch (error) {
            console.log(error);
            if (error.code === "P2002") {
                return res
                    .status(errorCodes.CONFLICT)
                    .json({ status: statusTypes.UNIQUE_VIOLATION, message: "Usuário já existe" });
            }

            return res.status(errorCodes.INTERNAL_SERVER).json({ message: error.message });
        }
    }

    async update(req, res) {
        try {
            const { userId } = req.body.nurseParams;
            delete req.body.nurseParams.userId;
            const nurse = await this.nurse.update({
                where: { userId },
                data: { ...req.body.nurseParams, user: { update: { ...req.body.userParams } } },
                select: this.nurseProperties,
            });
            res.json({ message: "Enfermeiro atualizado.", payload: { nurse } });
        } catch (error) {
            console.log(error);
            if (error.code === "P2002") {
                return res
                    .status(errorCodes.CONFLICT)
                    .json({ status: statusTypes.UNIQUE_VIOLATION, message: "Enfermeiro já existe." });
            }
            if (error.code === "P2025") {
                return res.status(errorCodes.NOT_FOUND).json({ message: "Enfermeiro não encontrado." });
            }

            return res.status(errorCodes.INTERNAL_SERVER).json({ message: error.message });
        }
    }

    async disable(req, res) {
        try {
            await this.nurse.update({
                where: { userId: +req.params.userId },
                data: {
                    active: false,
                },
            });

            res.json({ message: "Enfermeiro desabilitado." });
        } catch (error) {
            if (error.code === "P2025") {
                return res.status(errorCodes.NOT_FOUND).json({ message: "Enfermeiro não encontrado." });
            }

            return res.status(errorCodes.INTERNAL_SERVER).json({ message: error.message });
        }
    }

    async enable(req, res) {
        try {
            await this.nurse.update({
                where: { userId: +req.params.userId },
                data: {
                    active: true,
                },
            });

            res.json({ message: "Enfermeiro habilitado." });
        } catch (error) {
            if (error.code === "P2025") {
                return res.status(errorCodes.NOT_FOUND).json({ message: "Enfermeiro não encontrado." });
            }

            return res.status(errorCodes.INTERNAL_SERVER).json({ message: error.message });
        }
    }
}

module.exports = NurseController;
