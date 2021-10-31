const NursePrescriptionController = require("../controllers/NursePrescriptionController");
const { validate, Joi } = require("express-validation");
const { verifyJWT, verifyGroup } = require("../middlewares/auth.middleware");

const nursePrescriptionController = new NursePrescriptionController();

module.exports = (app) => {
    const createValidation = {
        body: Joi.object({
            obs: Joi.string().optional().allow(""),
            prescription: Joi.string().required(),
            medicalRecordId: Joi.number().required(),
        }),
    };

    const updateRealizedValidation = {
        body: Joi.object({
            id: Joi.number().required(),
        }),
    };

    app.get(
        "/nurse-prescription",
        [verifyJWT, (req, res, next) => verifyGroup(req, res, next, ["ENFERMAGEM", "MEDICOS"])],
        (req, res) => {
            nursePrescriptionController.findAll(req, res);
        }
    );

    app.get(
        "/nurse-prescription/:id",
        [verifyJWT, (req, res, next) => verifyGroup(req, res, next, ["ENFERMAGEM", "MEDICOS"])],
        (req, res) => {
            nursePrescriptionController.findOneById(req, res);
        }
    );

    app.post(
        "/nurse-prescription",
        [validate(createValidation), verifyJWT, (req, res, next) => verifyGroup(req, res, next, ["ENFERMAGEM"])],
        (req, res) => {
            nursePrescriptionController.create(req, res);
        }
    );

    app.patch(
        "/nurse-prescription/set-realized",
        [
            validate(updateRealizedValidation),
            verifyJWT,
            (req, res, next) => verifyGroup(req, res, next, ["ENFERMAGEM"]),
        ],
        (req, res) => {
            nursePrescriptionController.setRealized(req, res);
        }
    );
};
