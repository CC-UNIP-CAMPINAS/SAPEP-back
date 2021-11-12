const LinkResetPasswordController = require("../controllers/LinkResetPasswordController");
const { verifyJWT } = require("../middlewares/auth.middleware");

module.exports = (app) => {
    const controller = new LinkResetPasswordController();
    app.post("/reset-password", [verifyJWT], (req, res, next) => {
        controller.create(req, res);
    });

    app.get("/reset-password/confirm/:id", (req, res, next) => {
        controller.confirm(req, res);
    });
};
