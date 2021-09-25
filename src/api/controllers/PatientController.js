const { errorCodes, statusTypes } = require("../config/express.config");
const PrismaService = require("../services/prisma/prisma.service");

class PatientController {
    constructor() {
        this.patient = new PrismaService().patient;
    }

    async findAll(_, res) {
        try {
            const allPatients = await this.patient.findMany();
            return res.status(errorCodes.OK).json(allPatients);
        } catch (error) {
            return res.status(errorCodes.INTERNAL_SERVER).json(error.message);
        }
    }

    async findOneById(req, res) {
        try {
            if (Number.isInteger(+req.params.id)) {
                //NOTE ou envia vazio e da erro, ou envia algo que não é número
                const patient = await this.patient.findUnique({ where: { id: +req.params.id } });
                if (patient) {
                    return res.json(patient);
                } else {
                    return res.json({});
                }
            } else {
                return res.status(errorCodes.BAD_REQUEST).json({ message: "Campos obrigatórios faltantes." });
            }
        } catch (error) {
            return res.status(errorCodes.INTERNAL_SERVER).json(error.message);
        }
    }

    async create(req, res) {
        try {
            const patient = await this.patient.create({
                data: {
                    ...req.body,
                },
            });
            return res.status(errorCodes.CREATED).json(patient);
        } catch (error) {
            if (error.code === "P2002") {
                return res
                    .status(errorCodes.INTERNAL_SERVER)
                    .json({ status: statusTypes.UNIQUE_VIOLATION, message: "Paciente já existe." });
            }
            console.log(error);
            return res.status(errorCodes.INTERNAL_SERVER).json(error.message);
        }
    }

    async delete(req, res) {
        try {
            if (Number.isInteger(+req.params.id)) {
                //NOTE ou envia vazio e da erro, ou envia algo que não é número
                await this.patient.delete({ where: { id: +req.params.id } });

                return res.json({ message: "Paciente deletado." });
            } else {
                return res.status(errorCodes.BAD_REQUEST).json({ message: "Campos obrigatórios faltantes." });
            }
        } catch (error) {
            if (error.code === "P2025") {
                return res.status(errorCodes.BAD_REQUEST).json({ message: "Paciente não encontrado." });
            }
            console.log(error);
            return res.status(500).json(error.message);
        }
    }

    async update(req, res) {
        try {
            const patient = await this.patient.update({
                where: { id: +req.body.id },
                data: {
                    ...req.body,
                    id: +req.body.id,
                },
            });

            return res.status(errorCodes.OK).json(patient);
        } catch (error) {
            console.log(error);
            if (error.code === "P2002") {
                return res
                    .status(errorCodes.INTERNAL_SERVER)
                    .json({ status: statusTypes.UNIQUE_VIOLATION, message: "Paciente já existe." });
            }
            if (error.code === "P2025") {
                return res.status(errorCodes.BAD_REQUEST).json({ message: "Paciente não encontrado." });
            }
            return res.status(errorCodes.INTERNAL_SERVER).json(error.message);
        }
    }
}

module.exports = PatientController;
