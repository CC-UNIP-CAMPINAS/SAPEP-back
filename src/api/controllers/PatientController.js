const cep = require("cep-promise");
const { errorCodes, statusTypes } = require("../config/express.config");
const PrismaService = require("../services/prisma/prisma.service");

const include = {
    include: {
        MedicalRecord: {
            include: {
                MedicalPrescription: {
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
                        canceled: true,
                        prescriptionDate: true,
                        drug: true,
                        drugDosage: true,
                        drugWay: true,
                        administrationInterval: true,
                        administrationCount: true,
                        realized: true,
                        obs: true,
                        id: true,
                    },
                },
                NursePrescription: {
                    select: {
                        canceled: true,
                        id: true,
                        executionDate: true,
                        obs: true,
                        prescription: true,
                        realized: true,
                        prescriptionDate: true,
                        Executor: { select: { user: { select: { name: true } } } },
                        Prescriber: { select: { user: { select: { name: true, email: true } } } },
                    },
                },
                TeamReport: {
                    select: { report: true, signatory: { select: { name: true } }, reportDate: true },
                },
                NurseReport: {
                    select: {
                        report: true,
                        signatory: { select: { user: { select: { name: true } } } },
                        reportDate: true,
                    },
                },
            },
        },
    },
};

class PatientController {
    constructor() {
        this.patient = new PrismaService().patient;
    }

    async findAll(req, res) {
        const includeTemp = ["ADM", "ROOT"].includes(req.group) ? {} : include;
        try {
            const allPatients = await this.patient.findMany({
                ...includeTemp,
            });

            for (const patient of allPatients) {
                if (patient.cep) {
                    const address = await cep(patient.cep);
                    patient.address = `${address.street}, ${patient.addressNumber} - ${address.neighborhood}, ${
                        address.city
                    } - ${address.state}${patient.complement ? ` - Complemento: ${patient.complement}` : ""}`;
                } else {
                    patient.address = "N??O CONSTA";
                }
            }

            return res.status(errorCodes.OK).json(allPatients);
        } catch (error) {
            return res.status(errorCodes.INTERNAL_SERVER).json(error.message);
        }
    }

    async findOneById(req, res) {
        try {
            const includeTemp = ["ADM", "ROOT"].includes(req.group) ? {} : include;
            if (Number.isInteger(+req.params.id)) {
                //NOTE ou envia vazio e da erro, ou envia algo que n??o ?? n??mero
                const patient = await this.patient.findUnique({
                    where: { id: +req.params.id },
                    ...includeTemp,
                });

                if (patient) {
                    if (patient.cep) {
                        const address = await cep(patient.cep);
                        patient.address = `${address.street}, ${patient.addressNumber} - ${address.neighborhood}, ${
                            address.city
                        } - ${address.state}${patient.complement ? ` - Complemento: ${patient.complement}` : ""}`;
                    }
                    return res.json(patient);
                } else {
                    return res.json({});
                }
            } else {
                return res.status(errorCodes.BAD_REQUEST).json({ message: "Campos obrigat??rios faltantes." });
            }
        } catch (error) {
            return res.status(errorCodes.INTERNAL_SERVER).json(error.message);
        }
    }

    async create(req, res) {
        try {
            const includeTemp = ["ADM", "ROOT"].includes(req.group) ? {} : include;
            const patient = await this.patient.create({
                data: {
                    ...req.body,
                    MedicalRecord: { create: {} },
                },
                ...includeTemp,
            });

            if (patient.cep) {
                const address = await cep(patient.cep);
                patient.address = `${address.street}, ${patient.addressNumber} - ${address.neighborhood}, ${
                    address.city
                } - ${address.state}${patient.complement ? ` - Complemento: ${patient.complement}` : ""}`;
            } else {
                patient.address = "N??O CONSTA";
            }

            return res.status(errorCodes.CREATED).json(patient);
        } catch (error) {
            if (error.code === "P2002") {
                return res.status(errorCodes.INTERNAL_SERVER).json({
                    status: statusTypes.UNIQUE_VIOLATION,
                    message: "Paciente j?? existe.",
                });
            }
            console.log(error);
            return res.status(errorCodes.INTERNAL_SERVER).json(error.message);
        }
    }

    async delete(req, res) {
        try {
            if (Number.isInteger(+req.params.id)) {
                //NOTE ou envia vazio e da erro, ou envia algo que n??o ?? n??mero
                await this.patient.delete({ where: { id: +req.params.id } });

                return res.json({ message: "Paciente deletado." });
            } else {
                return res.status(errorCodes.BAD_REQUEST).json({ message: "Campos obrigat??rios faltantes." });
            }
        } catch (error) {
            if (error.code === "P2025") {
                return res.status(errorCodes.BAD_REQUEST).json({ message: "Paciente n??o encontrado." });
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

            if (patient.cep) {
                const address = await cep(patient.cep);
                patient.address = `${address.street}, ${patient.addressNumber} - ${address.neighborhood}, ${
                    address.city
                } - ${address.state}${patient.complement ? ` - Complemento: ${patient.complement}` : ""}`;
            } else {
                patient.address = "N??O CONSTA";
            }

            return res.status(errorCodes.OK).json(patient);
        } catch (error) {
            console.log(error);
            if (error.code === "P2002") {
                return res.status(errorCodes.CONFLICT).json({
                    status: statusTypes.UNIQUE_VIOLATION,
                    message: "Paciente j?? existe.",
                });
            }
            if (error.code === "P2025") {
                return res.status(errorCodes.BAD_REQUEST).json({ message: "Paciente n??o encontrado." });
            }
            return res.status(errorCodes.INTERNAL_SERVER).json(error.message);
        }
    }

    async getAddressByCep(cep) {
        cep(cep)
            .then((result) => {
                return result;
            })
            .catch((error) => {
                return error;
            });
    }
}

module.exports = PatientController;
