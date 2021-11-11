const LinkResetEmailController = require("../controllers/LinkResetEmailController");
const { verifyJWT } = require("../middlewares/auth.middleware");

module.exports = (app) => {
    const controller = new LinkResetEmailController();
    app.post("/reset-email", [verifyJWT], (req, res, next) => {
        controller.create(req, res);
    });

    app.get("/reset-email/confirm/:id", (req, res, next) => {
        controller.confirm(req, res);
    });
};
