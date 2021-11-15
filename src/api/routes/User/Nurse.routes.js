const NurseController = require("../../controllers/User/NurseController");
const { validate, Joi } = require("express-validation");
const { verifyJWT, verifyGroup } = require("../../middlewares/auth.middleware");

const nurseController = new NurseController();

module.exports = (app) => {
    const createValidation = {
        body: Joi.object({
            coren: Joi.string().required(),
            email: Joi.string().required(),
            password: Joi.string().required(),
            phone: Joi.string().optional().empty(""),
            gender: Joi.string().optional(),
            name: Joi.string().required(),
        }),
    };

    const updateValidation = {
        body: Joi.object({
            userParams: Joi.object({
                email: Joi.string().required(),
                phone: Joi.string().optional().empty(""),
                gender: Joi.string().optional(),
                name: Joi.string().required(),
            }).required(),
            nurseParams: Joi.object({
                userId: Joi.number().required(),
                coren: Joi.string().required(),
            }).required(),
        }),
    };
    const selectOneByCorenValidation = {
        body: Joi.object({
            coren: Joi.string().required(),
        }),
    };

    const activationValidation = {
        params: Joi.object({
            userId: Joi.number().required(),
        }),
    };

    app.patch(
        "/user/nurse",
        [validate(updateValidation), verifyJWT, (req, res, next) => verifyGroup(req, res, next, ["ROOT"])],
        (req, res) => {
            nurseController.update(req, res);
        }
    );

    app.patch(
        "/user/nurse/disable/:userId",
        [validate(activationValidation), verifyJWT, (req, res, next) => verifyGroup(req, res, next, ["ROOT"])],
        (req, res) => {
            nurseController.disable(req, res);
        }
    );

    app.patch(
        "/user/nurse/enable/:userId",
        [validate(activationValidation), verifyJWT, (req, res, next) => verifyGroup(req, res, next, ["ROOT"])],
        (req, res) => {
            nurseController.enable(req, res);
        }
    );

    app.post(
        "/user/nurse",
        [validate(createValidation), verifyJWT, (req, res, next) => verifyGroup(req, res, next, ["ROOT"])],
        (req, res) => {
            nurseController.create(req, res);
        }
    );

    app.get("/user/nurse", [verifyJWT, (req, res, next) => verifyGroup(req, res, next, ["ROOT"])], (req, res) => {
        nurseController.findAll(req, res);
    });

    app.get(
        "/user/nurse/coren",
        [validate(selectOneByCorenValidation), verifyJWT, (req, res, next) => verifyGroup(req, res, next, ["ROOT"])],
        (req, res) => {
            nurseController.findOneByCoren(req, res);
        }
    );
};
