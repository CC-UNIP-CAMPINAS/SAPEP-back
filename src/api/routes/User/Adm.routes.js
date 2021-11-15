const AdmController = require("../../controllers/User/AdmController");
const { validate, Joi } = require("express-validation");
const { verifyJWT, verifyGroup } = require("../../middlewares/auth.middleware");

const admController = new AdmController();

module.exports = (app) => {
  const createValidation = {
    body: Joi.object({
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
      admParams: Joi.object({
        userId: Joi.number().required(),
      }).required(),
    }),
  };

  const activationValidation = {
    params: Joi.object({
      userId: Joi.number().required(),
    }),
  };

  app.patch(
    "/user/adm",
    [
      validate(updateValidation),
      verifyJWT,
      (req, res, next) => verifyGroup(req, res, next, ["ROOT"]),
    ],
    (req, res) => {
      admController.update(req, res);
    }
  );

  app.patch(
    "/user/adm/disable/:userId",
    [
      validate(activationValidation),
      verifyJWT,
      (req, res, next) => verifyGroup(req, res, next, ["ROOT"]),
    ],
    (req, res) => {
      admController.disable(req, res);
    }
  );

  app.patch(
    "/user/adm/enable/:userId",
    [
      validate(activationValidation),
      verifyJWT,
      (req, res, next) => verifyGroup(req, res, next, ["ROOT"]),
    ],
    (req, res) => {
      admController.enable(req, res);
    }
  );

  app.post(
    "/user/adm",
    [
      validate(createValidation),
      verifyJWT,
      (req, res, next) => verifyGroup(req, res, next, ["ROOT"]),
    ],
    (req, res) => {
      admController.create(req, res);
    }
  );

  app.get(
    "/user/adm",
    [verifyJWT, (req, res, next) => verifyGroup(req, res, next, ["ROOT"])],
    (req, res) => {
      admController.findAll(req, res);
    }
  );
};
