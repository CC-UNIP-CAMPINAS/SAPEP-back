const LinkResetPasswordController = require("../controllers/LinkResetPasswordController");
const { validate, Joi } = require("express-validation");

module.exports = (app) => {
    const createValidation = {
        body: Joi.object({
            email: Joi.string().required(),
        }),
    };

    const confirmValidation = {
        body: Joi.object({
            newPassword: Joi.string().required(),
        }),
        params: Joi.object({
            id: Joi.string().required(),
        }),
    };

    const isValidValidation = {
        params: Joi.object({
            id: Joi.string().required(),
        }),
    };

    const controller = new LinkResetPasswordController();
    app.post("/reset-password", [validate(createValidation)], (req, res, next) => {
        controller.create(req, res);
    });

    app.post("/reset-password/confirm/:id", validate(confirmValidation), (req, res, next) => {
        controller.confirm(req, res);
    });

    app.get("/reset-password/is-valid/:id", validate(isValidValidation), (req, res, next) => {
        controller.findOne(req, res);
    });
};
