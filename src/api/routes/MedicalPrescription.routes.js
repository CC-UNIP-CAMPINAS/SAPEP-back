const MedicalPrescriptionController = require("../controllers/MedicalPrescriptionController");
const { validate, Joi } = require("express-validation");
const { verifyJWT, verifyGroup } = require("../middlewares/auth.middleware");

const medicalPrescriptionController = new MedicalPrescriptionController();

module.exports = (app) => {
  const createValidation = {
    body: Joi.object({
      obs: Joi.string().optional(),
      drug: Joi.string().required(),
      drugDosage: Joi.string().required(),
      drugWay: Joi.string().required(),
      administrationInterval: Joi.string().required(),
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

  app.get(
    "/medical-prescription",
    [
      verifyJWT,
      (req, res, next) =>
        verifyGroup(req, res, next, ["ENFERMAGEM", "MEDICOS", "ROOT"]),
    ],
    (req, res) => {
      medicalPrescriptionController.findAll(req, res);
    }
  );
  app.post(
    "/medical-prescription",
    [verifyJWT, (req, res, next) => verifyGroup(req, res, next, ["MEDICOS"])],
    validate(createValidation),
    (req, res) => {
      medicalPrescriptionController.create(req, res);
    }
  );
  app.get(
    "/medical-prescription/:id",
    [
      verifyJWT,
      (req, res, next) =>
        verifyGroup(req, res, next, ["ENFERMAGEM", "MEDICOS", "ROOT"]),
    ],
    (req, res) => {
      medicalPrescriptionController.findOneById(req, res);
    }
  );
  app.patch(
    "/medical-prescription",
    [
      validate(updateValidation),
      verifyJWT,
      (req, res, next) => verifyGroup(req, res, next, ["MEDICOS"]),
    ],
    (req, res) => {
      medicalPrescriptionController.update(req, res);
    }
  );
  app.patch(
    "/medical-prescription/set-realized",
    [
      validate(updateRealizedValidation),
      verifyJWT,
      (req, res, next) => verifyGroup(req, res, next, ["ENFERMAGEM"]),
    ],
    (req, res) => {
      medicalPrescriptionController.setRealized(req, res);
    }
  );
};
