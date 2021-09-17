const AuthController = require("../controllers/AuthController");
const { verifyJWT } = require("../middlewares/auth.middleware");

module.exports = (app) => {
    const authController = new AuthController();

    app.get("/", (_, res) => {
        res.send({ app: "SAPEP", date: new Date() });
    });

    app.post("/login", (req, res) => {
        authController.login(req, res);
    });

    app.post("/login-jwt", [verifyJWT], (req, res) => {
        authController.loginJwt(req, res);
    });
};
