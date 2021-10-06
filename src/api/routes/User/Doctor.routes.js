const DoctorController = require("../../controllers/User/DoctorController");
const { validate, Joi } = require("express-validation");

const doctorController = new DoctorController();

module.exports = (app) => {
    const createValidation = {
        body: Joi.object({
            crm: Joi.string().required(),
            area: Joi.string().required(),
            email: Joi.string().required(),
            password: Joi.string().required(),
            phone: Joi.string().optional(),
            gender: Joi.string().optional(),
            name: Joi.string().required(),
        }),
    };

    const updateValidation = {
        body: Joi.object({
            userParams: Joi.object({
                email: Joi.string().required(),
                email: Joi.string().required(),
                phone: Joi.string().optional(),
                gender: Joi.string().optional(),
                name: Joi.string().required(),
            }).required(),
            doctorParams: Joi.object({
                userId: Joi.number().required(),
                crm: Joi.string().required(),
                area: Joi.string().required(),
            }).required(),
        }),
    };
    const selectOneByCrmValidation = {
        body: Joi.object({
            crm: Joi.string().required(),
        }),
    };

    const deleteValidation = {
        params: Joi.object({
            userId: Joi.number().required(),
        }),
    };

    app.patch("/user/doctor", validate(updateValidation), (req, res) => {
        doctorController.update(req, res);
    });

    app.delete("/user/doctor/:userId", validate(deleteValidation), (req, res) => {
        doctorController.delete(req, res);
    });

    app.post("/user/doctor", validate(createValidation), (req, res) => {
        doctorController.create(req, res);
    });

    app.get("/user/doctor", (req, res) => {
        doctorController.findAll(req, res);
    });

    app.get("/user/doctor/crm", validate(selectOneByCrmValidation), (req, res) => {
        doctorController.findOneByCrm(req, res);
    });
};
