const UserController = require("../controllers/UserController");

const userController = new UserController();

module.exports = (app) => {
    app.get("/", (_, res) => {
        res.send({ app: "SAPEP", date: new Date() });
    });

    app.post("/login", (req, res) => {
        userController.login(req, res);
    });
};
