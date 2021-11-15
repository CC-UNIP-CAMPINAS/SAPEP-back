const dayjs = require("dayjs");
const utc = require("dayjs/plugin/utc");
const { errorCodes } = require("../config/express.config");
const PrismaService = require("../services/prisma/prisma.service");

class NursePrescriptionController {
    constructor() {
        this.nursePrescription = new PrismaService().nursePrescription;
    }

    async findAll(_, res) {
        try {
            const allNursePrescription = await this.nursePrescription.findMany();
            return res.status(errorCodes.OK).json(allNursePrescription);
        } catch (error) {
            return res.status(errorCodes.INTERNAL_SERVER).json(error.message);
        }
    }

    async findOneById(req, res) {
        try {
            if (Number.isInteger(+req.params.id)) {
                //NOTE ou envia vazio e da erro, ou envia algo que não é número
                const nursePrescription = await this.nursePrescription.findUnique({
                    where: { id: +req.params.id },
                });
                if (nursePrescription) {
                    return res.json(nursePrescription);
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
            const nursePrescription = await this.nursePrescription.create({
                data: {
                    ...req.body,
                    medicalRecordId: +req.body.medicalRecordId,
                    prescriberId: req.idUser,
                },
                select: {
                    id: true,
                    executionDate: true,
                    canceled: true,
                    obs: true,
                    prescription: true,
                    realized: true,
                    prescriptionDate: true,
                    Executor: { select: { user: { select: { name: true } } } },
                    Prescriber: { select: { user: { select: { name: true, email: true } } } },
                },
            });
            res.json(nursePrescription);
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
            const nursePrescription = await this.nursePrescription.update({
                where: { id: +req.body.id },
                data: {
                    obs: req.body.obs,
                },
            });
            res.json(nursePrescription);
        } catch (error) {
            if (error.code === "P2025") {
                return res.status(errorCodes.BAD_REQUEST).json({ message: "Prescrição de enfermagem não encontrado." });
            }
            return res.status(errorCodes.INTERNAL_SERVER).json(error.message);
        }
    }

    async setRealized(req, res) {
        try {
            const nursePrescription = await this.nursePrescription.findUnique({
                where: { id: +req.body.id },
                select: { realized: true, canceled: true },
            });

            if (!nursePrescription)
                return res.status(errorCodes.BAD_REQUEST).json({ message: "Prescrição de enfermagem não encontrado." });

            if (nursePrescription.canceled) {
                return res
                    .status(errorCodes.BAD_REQUEST)
                    .json({ message: "Não é possível executar uma prescrição cancelada." });
            }

            if (!nursePrescription.realized) {
                dayjs.extend(utc);
                const date = dayjs.utc().toISOString();
                const nursePrescription = await this.nursePrescription.update({
                    where: { id: +req.body.id },
                    data: {
                        executorId: req.idUser,
                        realized: true,
                        executionDate: date,
                    },
                    select: {
                        id: true,
                        executionDate: true,
                        realized: true,
                        Executor: { select: { user: { select: { name: true } } } },
                    },
                });
                return res.json(nursePrescription);
            }

            res.status(errorCodes.CONFLICT).json({ message: "Está prescrição já foi realizada." });
        } catch (error) {
            if (error.code === "P2025") {
                return res.status(errorCodes.BAD_REQUEST).json({ message: "Prescrição de enfermagem não encontrado." });
            }
            return res.status(errorCodes.INTERNAL_SERVER).json(error.message);
        }
    }

    async setCanceled(req, res) {
        try {
            dayjs.extend(utc);
            const prescriptionToCompare = await this.nursePrescription.findFirst({
                include: { Executor: true },
                where: { id: +req.params.id, Prescriber: { userId: req.idUser } },
            });

            if (!prescriptionToCompare) {
                return res
                    .status(errorCodes.NOT_AUTHORIZED)
                    .json({ message: "Não é possível cancelar uma prescrição que você não criou." });
            }

            if (prescriptionToCompare.Executor) {
                return res
                    .status(errorCodes.NOT_AUTHORIZED)
                    .json({ message: "Não é possível cancelar uma prescrição que já foi administrada." });
            }

            if (dayjs.utc().isAfter(dayjs.utc(prescriptionToCompare.prescriptionDate).add(24, "hours"))) {
                return res
                    .status(errorCodes.NOT_AUTHORIZED)
                    .json({ message: "Não é possível cancelar uma prescrição com mais de 24 horas de criação." });
            }

            const prescription = await this.nursePrescription.update({
                where: { id: +req.params.id },
                data: { canceled: true },
                select: {
                    id: true,
                    canceled: true,
                },
            });

            res.json(prescription);
        } catch (error) {
            console.log(error);
            if (error.code === "P2025") {
                return res.status(errorCodes.BAD_REQUEST).json({ message: "Prescrição de enfermagem não encontrada." });
            }
            return res.status(errorCodes.INTERNAL_SERVER).json(error.message);
        }
    }
}

module.exports = NursePrescriptionController;
