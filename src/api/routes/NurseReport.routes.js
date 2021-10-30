const NurseReportController = require("../controllers/NurseReportController");
const { validate, Joi } = require("express-validation");
const { verifyJWT, verifyGroup } = require("../middlewares/auth.middleware");

const nurseReportController = new NurseReportController();

module.exports = (app) => {
  const createValidation = {
    body: Joi.object({
      report: Joi.string().required(),
      medicalRecordId: Joi.number().required(),
    }),
  };

  app.post(
    "/nurse-report",
    [
      validate(createValidation),
      verifyJWT,
      (req, res, next) => verifyGroup(req, res, next, ["ENFERMAGEM"]),
    ],
    (req, res) => {
      nurseReportController.create(req, res);
    }
  );
};
