const JwtController = require("../controllers/JwtController");

module.exports = (app) => {
    const jwtController = new JwtController();

    app.route("/jwt").get((req, res) => {
        jwtController.findAll(req, res);
    });
};
