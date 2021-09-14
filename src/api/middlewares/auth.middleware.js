const { statusTypes, errorCodes } = require("../config/express.config");
const jwt = require("jsonwebtoken");

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

        // TODO Procurar pelo token no DB;

        const result = await jwt.verify(jwtObject.token); // NOTE Verifica se o token achado é válido

        if (result) {
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

async function createJWT() {
    return jwt.sign({}, process.env.JWT_KEY, {
        expiresIn: "5h", // expires in 5 hours
    });
}

module.exports = { verifyJWT, createJWT };
