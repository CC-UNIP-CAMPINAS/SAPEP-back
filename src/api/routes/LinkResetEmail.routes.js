const LinkResetEmailController = require("../controllers/LinkResetEmailController");
const { verifyJWT } = require("../middlewares/auth.middleware");
const { validate, Joi } = require("express-validation");

module.exports = (app) => {
    const createValidation = {
        body: Joi.object({
            newEmail: Joi.string().required(),
        }),
    };

    const confirmValidation = {
        params: Joi.object({
            id: Joi.string().required(),
        }),
    };

    const controller = new LinkResetEmailController();
    app.post("/reset-email", [validate(createValidation), verifyJWT], (req, res, next) => {
        controller.create(req, res);
    });

    app.get("/reset-email/confirm/:id", validate(confirmValidation), (req, res, next) => {
        controller.confirm(req, res);
    });
};
