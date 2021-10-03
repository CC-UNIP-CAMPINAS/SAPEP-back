const { errorCodes } = require("../config/express.config");
const PrismaService = require("../services/prisma/prisma.service");

class MedicalPrescriptionController {
    constructor() {
        this.medicalPrescription = new PrismaService().medicalPrescription;
    }

    async findAll(_, res) {
        try {
            const allMedicalPrescriptions = await this.medicalPrescription.findMany();
            return res.status(errorCodes.OK).json(allMedicalPrescriptions);
        } catch (error) {
            return res.status(errorCodes.INTERNAL_SERVER).json(error.message);
        }
    }

    async findOneById(req, res) {
        try {
            if (Number.isInteger(+req.params.id)) {
                //NOTE ou envia vazio e da erro, ou envia algo que não é número
                const medicalPrescription = await this.medicalPrescription.findUnique({
                    where: { id: +req.params.id },
                });
                if (medicalPrescription) {
                    return res.json(medicalPrescription);
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
            const medicalPrescription = await this.medicalPrescription.create({
                data: {
                    ...req.body,
                    medicalRecordId: +req.body.medicalRecordId,
                    prescriberId: +req.body.prescriberId,
                },
            });
            res.json(medicalPrescription);
        } catch (error) {
            if (error.code === "P2003") {
                switch (error.meta.field_name) {
                    case "prescriberId":
                        return res.status(errorCodes.BAD_REQUEST).json({ message: "Prescritor não encontrado." });
                    case "medicalRecordId":
                        return res.status(errorCodes.BAD_REQUEST).json({ message: "Prontuário não encontrado." });
                    default:
                        break;
                }
            }
            return res.status(errorCodes.INTERNAL_SERVER).json(error.message);
        }
    }

    async update(req, res) {
        try {
            const medicalPrescription = await this.medicalPrescription.update({
                where: { id: +req.body.id },
                data: {
                    obs: req.body.obs,
                },
            });
            res.json(medicalPrescription);
        } catch (error) {
            if (error.code === "P2025") {
                return res.status(errorCodes.BAD_REQUEST).json({ message: "Prescrição médica não encontrada." });
            }
            return res.status(errorCodes.INTERNAL_SERVER).json(error.message);
        }
    }

    async setRealized(req, res) {
        try {
            const medicalPrescription = await this.medicalPrescription.findUnique({
                where: { id: +req.body.id },
                select: { realized: true },
            });

            if (!medicalPrescription)
                return res.status(errorCodes.BAD_REQUEST).json({ message: "Prescrição médica não encontrada." });

            if (!medicalPrescription.realized) {
                const medicalPrescription = await this.medicalPrescription.update({
                    where: { id: +req.body.id },
                    data: {
                        executorId: +req.body.executorId,
                        realized: true,
                        executionDate: new Date(),
                    },
                });
                return res.json(medicalPrescription);
            }

            res.status(errorCodes.CONFLICT).json({ message: "Está prescrição já foi executada." });
        } catch (error) {
            if (error.code === "P2025") {
                return res.status(errorCodes.BAD_REQUEST).json({ message: "Prescrição médica não encontrada." });
            }
            return res.status(errorCodes.INTERNAL_SERVER).json(error.message);
        }
    }
}

module.exports = MedicalPrescriptionController;