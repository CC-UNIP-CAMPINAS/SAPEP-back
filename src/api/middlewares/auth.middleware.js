const { statusTypes, errorCodes } = require("../config/express.config");
const jwt = require("jsonwebtoken");
const JwtController = require("../controllers/JwtController");

const jwtController = new JwtController();

const UserController = require("../controllers/User/UserController");
const userController = new UserController();

/**
 *
 *Middleware para validação de um token JWT
 */
async function verifyJWT(req, res, next) {
    try {
        const token = req.cookies?.sapep_token;
        if (!token)
            return res
                .status(errorCodes.NOT_AUTHORIZED)
                .send({ status: statusTypes.NOT_AUTHORIZED, message: "Token JWT faltante." });

        const jwtObject = await jwtController.findOne(token); // NOTE Procura pelo token no DB
        if (!jwtObject.User.active) {
            return res.status(errorCodes.NOT_AUTHORIZED).send({
                status: statusTypes.NOT_AUTHORIZED,
                message: "Usuário desativado.",
            });
        }

        const result = await jwt.verify(jwtObject.token, process.env.JWT_KEY); // NOTE Verifica se o token achado é válido

        if (result) {
            req.idUser = jwtObject.idUser;
            const group = await userController.findGroupByUserId(req.idUser);
            req.group = group.Groups.name;
            next();
        } else {
            res.clearCookie("sapep_token");
            return res
                .status(errorCodes.NOT_AUTHORIZED)
                .send({ status: statusTypes.NOT_AUTHORIZED, message: "Token JWT inválido." });
        }
    } catch (error) {
        res.status(errorCodes.INTERNAL_SERVER).send({ status: statusTypes.SERVER_ERROR, message: error.message });
    }
}

async function verifyGroup(req, res, next, allowedGroups) {
    const permission = allowedGroups.includes(req.group);

    if (permission) {
        next();
    } else {
        return res
            .status(errorCodes.NOT_AUTHORIZED)
            .send({ status: statusTypes.NOT_AUTHORIZED, message: "Usuário sem permissão do recurso." });
    }
}

module.exports = { verifyJWT, verifyGroup };
