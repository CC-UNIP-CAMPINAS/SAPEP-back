const { Router } = require("express");
const GroupController = require("../controllers/GroupController");
const route = Router();

route.get("/group", (req, res) => {
  GroupController.getAll(req, res);
});

module.exports = route;
