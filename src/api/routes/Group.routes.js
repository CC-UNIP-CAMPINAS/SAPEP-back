const { Router } = require("express");
const GroupController = require("../controllers/GroupController");
const route = Router();

const groupController = new GroupController();

route.get("/group", (req, res) => {
    groupController.findAll(req, res);
});

module.exports = route;
