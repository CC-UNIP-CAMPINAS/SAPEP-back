const NursePrescriptionController = require("../controllers/NursePrescriptionController");

const nursePrescriptionController = new NursePrescriptionController();

module.exports = (app) => {
    app.get("/nurse-prescription", (req, res) => {
        nursePrescriptionController.findAll(req, res);
    });
    app.get("/nurse-prescription/:id", (req, res) => {
        nursePrescriptionController.findOneById(req, res);
    });
};
