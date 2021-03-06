const DoctorController = require("../../controllers/User/DoctorController");
const { validate, Joi } = require("express-validation");
const { verifyJWT, verifyGroup } = require("../../middlewares/auth.middleware");

const doctorController = new DoctorController();

module.exports = (app) => {
  const createValidation = {
    body: Joi.object({
      crm: Joi.string().required(),
      area: Joi.string().required(),
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

  const activationValidation = {
    params: Joi.object({
      userId: Joi.number().required(),
    }),
  };

  app.patch(
    "/user/doctor",
    [
      validate(updateValidation),
      verifyJWT,
      (req, res, next) => verifyGroup(req, res, next, ["ROOT"]),
    ],
    (req, res) => {
      doctorController.update(req, res);
    }
  );

  app.patch(
    "/user/doctor/disable/:userId",
    [
      validate(activationValidation),
      verifyJWT,
      (req, res, next) => verifyGroup(req, res, next, ["ROOT"]),
    ],
    (req, res) => {
      doctorController.disable(req, res);
    }
  );

  app.patch(
    "/user/doctor/enable/:userId",
    [
      validate(activationValidation),
      verifyJWT,
      (req, res, next) => verifyGroup(req, res, next, ["ROOT"]),
    ],
    (req, res) => {
      doctorController.enable(req, res);
    }
  );

  app.post(
    "/user/doctor",
    [
      validate(createValidation),
      verifyJWT,
      (req, res, next) => verifyGroup(req, res, next, ["ROOT"]),
    ],
    (req, res) => {
      doctorController.create(req, res);
    }
  );

  app.get(
    "/user/doctor",
    [verifyJWT, (req, res, next) => verifyGroup(req, res, next, ["ROOT"])],
    (req, res) => {
      doctorController.findAll(req, res);
    }
  );

  app.get(
    "/user/doctor/crm",
    [
      validate(selectOneByCrmValidation),
      verifyJWT,
      (req, res, next) => verifyGroup(req, res, next, ["ROOT"]),
    ],
    (req, res) => {
      doctorController.findOneByCrm(req, res);
    }
  );
};
