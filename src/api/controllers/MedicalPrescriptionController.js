const dayjs = require("dayjs");
const utc = require("dayjs/plugin/utc");
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
            if (req.body.administrationCount <= 0) {
                return res.status(errorCodes.BAD_REQUEST).json({ message: "administrationCount zerado ou negativo." });
            }

            const medicalPrescription = await this.medicalPrescription.create({
                data: {
                    ...req.body,
                    medicalRecordId: +req.body.medicalRecordId,
                    prescriberId: req.idUser,
                },
                select: {
                    Executors: {
                        select: {
                            executionDate: true,
                            Executor: {
                                select: {
                                    user: {
                                        select: {
                                            name: true,
                                        },
                                    },
                                },
                            },
                        },
                    },
                    Prescriber: {
                        select: {
                            user: {
                                select: {
                                    name: true,
                                    email: true,
                                },
                            },
                        },
                    },
                    prescriptionDate: true,
                    drug: true,
                    drugDosage: true,
                    drugWay: true,
                    administrationInterval: true,
                    administrationCount: true,
                    realized: true,
                    obs: true,
                    canceled: true,
                    id: true,
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
                select: { canceled: true, realized: true, administrationCount: true, Executors: true },
            });

            if (medicalPrescription.canceled) {
                return res
                    .status(errorCodes.BAD_REQUEST)
                    .json({ message: "Não é possível executar uma prescrição cancelada." });
            }

            if (!medicalPrescription)
                return res.status(errorCodes.BAD_REQUEST).json({ message: "Prescrição médica não encontrada." });

            if (!medicalPrescription.realized) {
                const administrationCount = medicalPrescription.administrationCount;
                var executorsLength = 0;

                if (typeof medicalPrescription.Executors !== "undefined") {
                    executorsLength = medicalPrescription.Executors.length;
                }

                if (executorsLength < administrationCount) {
                    const realized = executorsLength + 1 == administrationCount;
                    const medicalPrescription = await this.medicalPrescription.update({
                        where: { id: +req.body.id },
                        select: {
                            id: true,
                            realized: true,
                            Executors: {
                                select: {
                                    executionDate: true,
                                    Executor: { select: { user: { select: { name: true, email: true } } } },
                                },
                            },
                        },
                        data: {
                            realized: realized,
                            Executors: {
                                create: {
                                    executionDate: new Date(),
                                    executorId: req.idUser,
                                },
                            },
                        },
                    });

                    return res.json(medicalPrescription);
                }
            } else {
                return res.status(errorCodes.CONFLICT).json({ message: "Está prescrição já foi executada." });
            }
        } catch (error) {
            if (error.code === "P2025") {
                return res.status(errorCodes.BAD_REQUEST).json({ message: "Prescrição médica não encontrada." });
            }
            return res.status(errorCodes.INTERNAL_SERVER).json(error.message);
        }
    }

    async setCanceled(req, res) {
        try {
            dayjs.extend(utc);
            const prescriptionToCompare = await this.medicalPrescription.findFirst({
                include: { Executors: true },
                where: { id: +req.params.id, Prescriber: { userId: req.idUser } },
            });

            if (!prescriptionToCompare) {
                return res
                    .status(errorCodes.NOT_AUTHORIZED)
                    .json({ message: "Não é possível cancelar uma prescrição que você não criou." });
            }

            if (prescriptionToCompare.Executors.length > 0) {
                return res
                    .status(errorCodes.NOT_AUTHORIZED)
                    .json({ message: "Não é possível cancelar uma prescrição que já teve alguma administração." });
            }

            if (dayjs.utc().isAfter(dayjs.utc(prescriptionToCompare.prescriptionDate).add(24, "hours"))) {
                return res
                    .status(errorCodes.NOT_AUTHORIZED)
                    .json({ message: "Não é possível cancelar uma prescrição com mais de 24 horas de criação." });
            }

            const prescription = await this.medicalPrescription.update({
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
                return res.status(errorCodes.BAD_REQUEST).json({ message: "Prescrição médica não encontrada." });
            }
            return res.status(errorCodes.INTERNAL_SERVER).json(error.message);
        }
    }
}

module.exports = MedicalPrescriptionController;
