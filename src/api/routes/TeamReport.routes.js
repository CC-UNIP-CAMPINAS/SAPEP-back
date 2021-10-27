const TeamReportController = require("../controllers/TeamReportController");
const { validate, Joi } = require("express-validation");
const { verifyJWT, verifyGroup } = require("../middlewares/auth.middleware");

const teamReportController = new TeamReportController();

module.exports = (app) => {
    const createValidation = {
        body: Joi.object({
            report: Joi.string().required(),
            medicalRecordId: Joi.number().required(),
        }),
    };

    app.post(
        "/team-report",
        [
            validate(createValidation),
            verifyJWT,
            (req, res, next) => verifyGroup(req, res, next, ["MEDICOS", "ENFERMAGEM"]),
        ],
        (req, res) => {
            teamReportController.create(req, res);
        }
    );
};
