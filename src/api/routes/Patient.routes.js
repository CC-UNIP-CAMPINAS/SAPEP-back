const PatientController = require("../controllers/PatientController");
const { validate, Joi } = require("express-validation");
const patientController = new PatientController();

const { verifyJWT, verifyGroup } = require("../middlewares/auth.middleware");

module.exports = (app) => {
    const createValidation = {
        body: Joi.object({
            name: Joi.string().required(),
            lastName: Joi.string().required(),
            cep: Joi.string().optional().allow(""),
            complement: Joi.string().optional().allow("").replace("", "NÃO CONSTA"),
            addressNumber: Joi.string().optional().allow("").replace("", "NÃO CONSTA"),
            phone: Joi.string().optional().allow("").replace("", "NÃO CONSTA"),
            birthday: Joi.string().required(),
            cpf: Joi.string().required(),
            rg: Joi.string().required(),
            healthInsurance: Joi.string().optional().allow("").replace("", "NÃO CONSTA"),
            gender: Joi.string().required(),
        }),
    };

    const updateValidation = {
        body: Joi.object({
            id: Joi.number().required(),
            name: Joi.string().required(),
            lastName: Joi.string().required(),
            cep: Joi.string().optional().allow(""),
            complement: Joi.string().optional().allow("").replace("", "NÃO CONSTA"),
            addressNumber: Joi.string().optional().allow("").replace("", "NÃO CONSTA"),
            phone: Joi.string().optional().allow("").replace("", "NÃO CONSTA"),
            birthday: Joi.string().required(),
            cpf: Joi.string().required(),
            rg: Joi.string().required(),
            healthInsurance: Joi.string().optional().allow("").replace("", "NÃO CONSTA"),
            gender: Joi.string().required(),
        }),
    };

    app.get(
        "/patient/:id",
        [verifyJWT, (req, res, next) => verifyGroup(req, res, next, ["ROOT", "MEDICOS", "ENFERMAGEM", "ADM"])],
        (req, res) => {
            patientController.findOneById(req, res);
        }
    );

    app.get(
        "/patient",
        [verifyJWT, (req, res, next) => verifyGroup(req, res, next, ["ROOT", "MEDICOS", "ENFERMAGEM", "ADM"])],
        (req, res) => {
            patientController.findAll(req, res);
        }
    );

    app.post(
        "/patient",
        [validate(createValidation), verifyJWT, (req, res, next) => verifyGroup(req, res, next, ["ROOT", "ADM"])],
        (req, res) => {
            patientController.create(req, res);
        }
    );

    app.delete("/patient/:id", [verifyJWT, (req, res, next) => verifyGroup(req, res, next, ["ROOT"])], (req, res) => {
        patientController.delete(req, res);
    });

    app.patch(
        "/patient",
        [validate(updateValidation), verifyJWT, (req, res, next) => verifyGroup(req, res, next, ["ROOT", "ADM"])],
        (req, res) => {
            patientController.update(req, res);
        }
    );
};
