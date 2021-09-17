const { compare } = require("bcrypt");
const { errorCodes } = require("../config/express.config");
const JwtController = require("./JwtController");
const UserController = require("./UserController");

class AuthController {
    constructor() {
        this.userController = new UserController();
        this.jwtController = new JwtController();
    }

    async login(req, res) {
        try {
            const { email, password } = req.body;
            const user = await this.userController.findOne(email);

            if (user) {
                if (await compare(password, user.password)) {
                    await this.jwtController.create(user.id);
                    return res.status(errorCodes.OK).json({ message: "Acesso permitido.", payload: true });
                } else {
                    return res.status(errorCodes.NOT_AUTHORIZED).json({ message: "Acesso negado.", payload: false });
                }
            } else {
                return res.status(errorCodes.NOT_FOUND).json({ message: "Usuário não encontrado." });
            }
        } catch (error) {
            return res.status(errorCodes.INTERNAL_SERVER).json({ message: error.message });
        }
    }
}

module.exports = AuthController;
