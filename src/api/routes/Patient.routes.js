const PatientController = require("../controllers/PatientController");

const patientController = new PatientController();

module.exports = (app) => {
    app.route("/patient")
        .get((req, res) => {
            patientController.findAll(req, res);
        })
        .patch((req, res) => {
            patientController.update(req, res);
        })
        .post((req, res) => {
            patientController.create(req, res);
        });

    app.get("/patient/:id", (req, res) => {
        patientController.findOneById(req, res);
    });
    app.delete("/patient/:id", (req, res) => {
        patientController.delete(req, res);
    });
};
