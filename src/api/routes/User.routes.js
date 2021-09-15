const UserController = require("../controllers/UserController");

const userController = new UserController();

module.exports = (app) => {
    app.get("/user", (req, res) => {
        userController.findAll(req, res);
    });
};
