const GroupController = require("../controllers/GroupController");

const groupController = new GroupController();

module.exports = (app) => {
    app.get("/group", (req, res) => {
        groupController.findAll(req, res);
    });
};
