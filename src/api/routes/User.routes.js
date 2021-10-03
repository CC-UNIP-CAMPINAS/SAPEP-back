const UserController = require("../controllers/UserController");
const { validate, Joi } = require("express-validation");

const userController = new UserController();

module.exports = (app) => {
    const getByGroupValidation = {
        params: Joi.object({
            id: Joi.number().required(),
        }),
    };

    app.route("/user")
        .get((req, res) => {
            userController.findAll(req, res);
        })
        .post((req, res) => {
            userController.create(req, res);
        });

    app.get("/user/group/:id", validate(getByGroupValidation), (req, res) => {
        userController.findAllByGroup(req, res);
    });
};
