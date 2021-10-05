const { compare } = require("bcrypt");
const { errorCodes } = require("../config/express.config");
const JwtController = require("./JwtController");
const UserController = require("./User/UserController");

class AuthController {
    constructor() {
        this.userController = new UserController();
        this.jwtController = new JwtController();
    }

    async loginJwt(req, res) {
        try {
            const user = await this.userController.findOneById(req.idUser, true);
            res.status(200).send({ message: "Acesso permitido.", payload: { user, auth: true } });
        } catch (error) {
            console.log(error);
            return res.status(errorCodes.INTERNAL_SERVER).json({ message: error.message });
        }
    }

    async login(req, res) {
        try {
            const { email, password } = req.body;
            const user = await this.userController.findOne(email, false);

            if (user) {
                if (await compare(password, user.password)) {
                    delete user.password;
                    const jwt = await this.jwtController.create(user.id);

                    res.cookie("sapep_token", jwt.token, {
                        httpOnly: true,
                        sameSite: true,
                        secure: process.env.NODE_ENV !== "production" ? false : true,
                        expires: jwt.expireAt,
                    });

                    return res
                        .status(errorCodes.OK)
                        .json({ message: "Acesso permitido.", payload: { user, auth: true } });
                } else {
                    return res
                        .status(errorCodes.NOT_AUTHORIZED)
                        .json({ message: "Acesso negado.", payload: { auth: false } });
                }
            } else {
                return res
                    .status(errorCodes.NOT_FOUND)
                    .json({ message: "Usuário não encontrado.", payload: { auth: false } });
            }
        } catch (error) {
            return res.status(errorCodes.INTERNAL_SERVER).json({ message: error.message });
        }
    }
}

module.exports = AuthController;
