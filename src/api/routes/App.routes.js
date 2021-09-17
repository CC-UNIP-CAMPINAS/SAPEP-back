const AuthController = require("../controllers/AuthController");

module.exports = (app) => {
    const authController = new AuthController();

    app.get("/", (_, res) => {
        res.send({ app: "SAPEP", date: new Date() });
    });

    app.post("/login", (req, res) => {
        authController.login(req, res);
    });
};
