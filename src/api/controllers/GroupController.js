const { statusTypes, errorCodes } = require("../config/express.config");
const PrismaService = require("../services/prisma/prisma.service");

class GroupController {
    constructor() {
        this.group = new PrismaService().group;
    }

    async findOneById(req, res) {
        try {
            if (Number.isInteger(+req.params.id)) {
                //NOTE ou envia vazio e da erro, ou envia algo que não é número
                const group = await this.group.findUnique({ where: { id: +req.params.id } });
                if (group) {
                    return res.status(200).json(group);
                } else {
                    return res.status(200).json({});
                }
            } else {
                return res.status(errorCodes.BAD_REQUEST).json({ message: "Campos obrigatórios faltantes." });
            }
        } catch (error) {
            return res.status(500).json(error.message);
        }
    }

    async findAll(_, res) {
        try {
            const allGroups = await this.group.findMany();
            return res.status(200).json(allGroups);
        } catch (error) {
            return res.status(500).json(error.message);
        }
    }

    async create(req, res) {
        try {
            const { name } = req.body;
            if (name) {
                const group = await this.group.create({ data: { name } });
                return res.status(errorCodes.CREATED).json({ message: "Group criado", payload: { group } });
            }

            return res.status(errorCodes.BAD_REQUEST).json({ message: "Campos obrigatórios faltantes." });
        } catch (error) {
            if (error.code === "P2002") {
                return res
                    .status(errorCodes.CONFLICT)
                    .json({ message: "Violação de campos únicos. Grupo não foi criado." });
            }
            return res.status(errorCodes.INTERNAL_SERVER).json(error.message);
        }
    }

    async delete(req, res) {
        try {
            if (Number.isInteger(+req.params.id)) {
                //NOTE ou envia vazio e da erro, ou envia algo que não é número
                await this.group.delete({ where: { id: +req.params.id } });

                return res.json({ message: "Grupo deletado." });
            } else {
                return res.status(errorCodes.BAD_REQUEST).json({ message: "Campos obrigatórios faltantes." });
            }
        } catch (error) {
            if (error.code === "P2025") {
                return res.status(errorCodes.BAD_REQUEST).json({ message: "Grupo não encontrado" });
            }
            console.log(error);
            return res.status(500).json(error.message);
        }
    }
}

module.exports = GroupController;
