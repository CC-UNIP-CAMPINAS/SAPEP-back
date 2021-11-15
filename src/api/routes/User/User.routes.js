const UserController = require("../../controllers/User/UserController");
const { validate, Joi } = require("express-validation");
const { verifyJWT, verifyGroup } = require("../../middlewares/auth.middleware");

const userController = new UserController();

module.exports = (app) => {
  const getByGroupValidation = {
    params: Joi.object({
      id: Joi.number().required(),
    }),
  };

  app.get(
    "/user",
    [verifyJWT, (req, res, next) => verifyGroup(req, res, next, ["ROOT"])],
    (req, res) => {
      userController.findAll(req, res);
    }
  );

  app.post(
    "/user",
    [verifyJWT, (req, res, next) => verifyGroup(req, res, next, ["ROOT"])],
    (req, res) => {
      userController.create(req, res);
    }
  );

  app.get(
    "/user/group/:id",
    [verifyJWT, (req, res, next) => verifyGroup(req, res, next, ["ROOT"])],
    (req, res) => {
      userController.findAllByGroup(req, res);
    }
  );
};
