const GroupController = require("../controllers/GroupController");

const groupController = new GroupController();

const { verifyJWT, verifyGroup } = require("../middlewares/auth.middleware");

module.exports = (app) => {
  app.get(
    "/group/:id",
    [verifyJWT, (req, res, next) => verifyGroup(req, res, next, ["ROOT"])],
    (req, res) => {
      groupController.findOneById(req, res);
    }
  );

  app.get(
    "/group",
    [verifyJWT, (req, res, next) => verifyGroup(req, res, next, ["ROOT"])],
    (req, res) => {
      groupController.findAll(req, res);
    }
  );

  app.post(
    "/group",
    [verifyJWT, (req, res, next) => verifyGroup(req, res, next, ["ROOT"])],
    (req, res) => {
      groupController.create(req, res);
    }
  );

  app.delete(
    "/group/:id",
    [verifyJWT, (req, res, next) => verifyGroup(req, res, next, ["ROOT"])],
    (req, res) => {
      groupController.delete(req, res);
    }
  );
};
