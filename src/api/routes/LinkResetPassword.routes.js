const LinkResetPasswordController = require("../controllers/LinkResetPasswordController");
const { verifyJWT } = require("../middlewares/auth.middleware");
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

    const controller = new LinkResetPasswordController();
    app.post("/reset-password", [validate(createValidation), verifyJWT], (req, res, next) => {
        controller.create(req, res);
    });

    app.get("/reset-password/confirm/:id", validate(confirmValidation), (req, res, next) => {
        controller.confirm(req, res);
    });
};
