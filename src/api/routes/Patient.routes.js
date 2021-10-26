const PatientController = require("../controllers/PatientController");

const patientController = new PatientController();

const { verifyJWT, verifyGroup } = require("../middlewares/auth.middleware");

module.exports = (app) => {
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

    app.post("/patient", [verifyJWT, (req, res, next) => verifyGroup(req, res, next, ["ROOT", "ADM"])], (req, res) => {
        patientController.create(req, res);
    });

    app.delete("/patient/:id", [verifyJWT, (req, res, next) => verifyGroup(req, res, next, ["ROOT"])], (req, res) => {
        patientController.delete(req, res);
    });
};
