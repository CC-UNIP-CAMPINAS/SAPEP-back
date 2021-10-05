const { hash } = require("bcrypt");
const { errorCodes, statusTypes } = require("../../config/express.config");
const PrismaService = require("../../services/prisma/prisma.service");

class DoctorController {
    constructor() {
        this.doctor = new PrismaService().doctor;
        this.user = new PrismaService().user;
    }

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
}

module.exports = DoctorController;
