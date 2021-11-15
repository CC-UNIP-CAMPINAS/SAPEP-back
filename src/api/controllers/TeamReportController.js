const { errorCodes } = require("../config/express.config");
const PrismaService = require("../services/prisma/prisma.service");

class TeamReportController {
    constructor() {
        this.teamReport = new PrismaService().teamReport;
    }

    async create(req, res) {
        try {
            const teamReport = await this.teamReport.create({
                data: {
                    ...req.body,
                    medicalRecordId: +req.body.medicalRecordId,
                    userId: req.idUser,
                },

                select: { report: true, signatory: { select: { name: true } }, reportDate: true },
            });
            res.json(teamReport);
        } catch (error) {
            console.log(error);
            if (error.code === "P2003") {
                switch (error.meta.field_name) {
                    case "userId":
                        return res.status(errorCodes.BAD_REQUEST).json({ message: "Colaborador não encontrado." });
                    case "medicalRecordId":
                        return res.status(errorCodes.BAD_REQUEST).json({ message: "Prontuário não encontrado." });
                    default:
                        break;
                }
            }
            return res.status(errorCodes.INTERNAL_SERVER).json(error.message);
        }
    }
}

module.exports = TeamReportController;
