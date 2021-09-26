const { errorCodes, statusTypes } = require("../config/express.config");
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
                const nursePrescription = await this.nursePrescription.findUnique({ where: { id: +req.params.id } });
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
                    prescriberId: +req.body.prescriberId,
                },
            });
            res.json(nursePrescription);
        } catch (error) {
            console.log(error);
            return res.status(errorCodes.INTERNAL_SERVER).json(error.message);
        }
    }
}

module.exports = NursePrescriptionController;
