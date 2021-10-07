const { hash } = require("bcrypt");
const { errorCodes, statusTypes } = require("../../config/express.config");
const PrismaService = require("../../services/prisma/prisma.service");

class DoctorController {
    constructor() {
        this.doctor = new PrismaService().doctor;
        this.user = new PrismaService().user;
    }

    doctorProperties = {
        area: true,
        crm: true,
        userId: true,
        user: {
            select: { email: true, gender: true, name: true, phone: true, groupId: true, updatedAt: true },
        },
    };

    async findAll(_, res) {
        try {
            const allDoctors = await this.doctor.findMany({
                include: {
                    user: {
                        select: { updatedAt: true, email: true, gender: true, groupId: true, name: true, phone: true },
                    },
                },
            });
            return res.status(errorCodes.OK).json(allDoctors);
        } catch (error) {
            return res.status(errorCodes.INTERNAL_SERVER).json(error.message);
        }
    }

    async findOneByCrm(req, res) {
        try {
            const doctor = await this.doctor.findUnique({
                where: { crm: req.body.crm },
                include: {
                    user: {
                        select: { updatedAt: true, email: true, gender: true, groupId: true, name: true, phone: true },
                    },
                },
            });
            return res.status(errorCodes.OK).json(doctor);
        } catch (error) {
            return res.status(errorCodes.INTERNAL_SERVER).json(error.message);
        }
    }

    async create(req, res) {
        try {
            const password = await hash(req.body.password, 12);
            const doctorParams = { crm: req.body.crm, area: req.body.area };
            const userParams = { ...req.body };
            delete userParams["crm"];
            delete userParams["area"];

            const user = await this.doctor.create({
                data: { ...doctorParams, user: { create: { ...userParams, password, groupId: 1 } } },
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
            const { userId } = req.body.doctorParams;
            delete req.body.doctorParams.userId;
            const doctor = await this.doctor.update({
                where: { userId },
                data: { ...req.body.doctorParams, user: { update: { ...req.body.userParams } } },
                select: this.doctorProperties,
            });
            res.json({ message: "Médico atualizado.", payload: { doctor } });
        } catch (error) {
            console.log(error);
            if (error.code === "P2002") {
                return res
                    .status(errorCodes.CONFLICT)
                    .json({ status: statusTypes.UNIQUE_VIOLATION, message: "Médico já existe." });
            }
            if (error.code === "P2025") {
                return res.status(errorCodes.NOT_FOUND).json({ message: "Médico não encontrado." });
            }

            return res.status(errorCodes.INTERNAL_SERVER).json({ message: error.message });
        }
    }

    async disable(req, res) {
        try {
            await this.doctor.update({
                where: { userId: +req.params.userId },
                data: {
                    active: false,
                },
            });

            res.json({ message: "Médico desabilitado." });
        } catch (error) {
            if (error.code === "P2025") {
                return res.status(errorCodes.NOT_FOUND).json({ message: "Médico não encontrado." });
            }

            return res.status(errorCodes.INTERNAL_SERVER).json({ message: error.message });
        }
    }

    async enable(req, res) {
        try {
            await this.doctor.update({
                where: { userId: +req.params.userId },
                data: {
                    active: true,
                },
            });

            res.json({ message: "Médico habilitado." });
        } catch (error) {
            if (error.code === "P2025") {
                return res.status(errorCodes.NOT_FOUND).json({ message: "Médico não encontrado." });
            }

            return res.status(errorCodes.INTERNAL_SERVER).json({ message: error.message });
        }
    }
}

module.exports = DoctorController;
