const NursePrescriptionController = require("../controllers/NursePrescriptionController");
const { validate, Joi } = require("express-validation");

const nursePrescriptionController = new NursePrescriptionController();

module.exports = (app) => {
    const createValidation = {
        body: Joi.object({
            obs: Joi.string().optional(),
            prescription: Joi.string().required(),
            medicalRecordId: Joi.number().required(),
            prescriberId: Joi.number().required(),
        }),
    };

    const updateValidation = {
        body: Joi.object({
            obs: Joi.string().required(),
            id: Joi.number().required(),
        }),
    };

    const updateRealizedValidation = {
        body: Joi.object({
            id: Joi.number().required(),
            executorId: Joi.number().required(),
        }),
    };

    app.get("/nurse-prescription", (req, res) => {
        nursePrescriptionController.findAll(req, res);
    });
    app.post("/nurse-prescription", validate(createValidation), (req, res) => {
        nursePrescriptionController.create(req, res);
    });
    app.get("/nurse-prescription/:id", (req, res) => {
        nursePrescriptionController.findOneById(req, res);
    });
    app.patch("/nurse-prescription", validate(updateValidation), (req, res) => {
        nursePrescriptionController.update(req, res);
    });
    app.patch("/nurse-prescription/set-realized", validate(updateRealizedValidation), (req, res) => {
        nursePrescriptionController.setRealized(req, res);
    });
};
