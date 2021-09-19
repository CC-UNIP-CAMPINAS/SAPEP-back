const GroupController = require("../controllers/GroupController");

const groupController = new GroupController();

module.exports = (app) => {
    app.get("/group/:id", (req, res) => {
        groupController.findOne(req, res);
    });

    app.get("/group", (req, res) => {
        groupController.findAll(req, res);
    });

    app.post("/group", (req, res) => {
        groupController.create(req, res);
    });

    app.delete("/group/:id", (req, res) => {
        groupController.delete(req, res);
    });
};
