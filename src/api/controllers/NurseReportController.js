const { errorCodes } = require("../config/express.config");
const PrismaService = require("../services/prisma/prisma.service");

class NurseReportController {
  constructor() {
    this.nurseReport = new PrismaService().nurseReport;
  }

  async create(req, res) {
    try {
      const nurseReport = await this.nurseReport.create({
        data: {
          ...req.body,
          medicalRecordId: +req.body.medicalRecordId,
          signatoryId: req.idUser,
        },

        select: {
          report: true,
          signatory: {
            select: {
              user: {
                select: {
                  name: true,
                },
              },
            },
          },
          reportDate: true,
        },
      });
      res.json(nurseReport);
    } catch (error) {
      console.log(error);
      if (error.code === "P2003") {
        switch (error.meta.field_name) {
          case "signatoryId":
            return res
              .status(errorCodes.BAD_REQUEST)
              .json({ message: "Enfermeiro(a) não encontrado." });
          case "medicalRecordId":
            return res
              .status(errorCodes.BAD_REQUEST)
              .json({ message: "Prontuário não encontrado." });
          default:
            break;
        }
      }
      return res.status(errorCodes.INTERNAL_SERVER).json(error.message);
    }
  }
}

module.exports = NurseReportController;
