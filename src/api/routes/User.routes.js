const UserController = require("../controllers/UserController");

const userController = new UserController();

module.exports = (app) => {
    app.route("/user")
        .get((req, res) => {
            userController.findAll(req, res);
        })
        .post((req, res) => {
            userController.create(req, res);
        });
};
