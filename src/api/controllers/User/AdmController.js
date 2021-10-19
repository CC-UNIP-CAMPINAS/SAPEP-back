const { hash } = require("bcrypt");
const { errorCodes, statusTypes } = require("../../config/express.config");
const PrismaService = require("../../services/prisma/prisma.service");

class AdmController {
  constructor() {
    this.adm = new PrismaService().adm;
    this.user = new PrismaService().user;
  }

  admProperties = {
    userId: true,
    active: true,
    user: {
      select: {
        email: true,
        gender: true,
        name: true,
        phone: true,
        groupId: true,
        updatedAt: true,
      },
    },
  };

  async findAll(_, res) {
    try {
      const allAdms = await this.adm.findMany({
        include: {
          user: {
            select: {
              updatedAt: true,
              email: true,
              gender: true,
              groupId: true,
              name: true,
              phone: true,
            },
          },
        },
      });
      return res.status(errorCodes.OK).json(allAdms);
    } catch (error) {
      return res.status(errorCodes.INTERNAL_SERVER).json(error.message);
    }
  }

  async create(req, res) {
    try {
      const password = await hash(req.body.password, 12);
      const admParams = { crm: req.body.crm, area: req.body.area };
      const userParams = { ...req.body };

      const user = await this.adm.create({
        data: {
          ...admParams,
          user: { create: { ...userParams, password, groupId: 3 } },
        },
        include: {
          user: {
            select: {
              name: true,
              email: true,
              gender: true,
              phone: true,
              updatedAt: true,
              email: true,
              groupId: true,
              id: true,
              createdAt: true,
            },
          },
        },
      });
      res.status(errorCodes.CREATED).json(user);
    } catch (error) {
      console.log(error);
      if (error.code === "P2002") {
        return res.status(errorCodes.CONFLICT).json({
          status: statusTypes.UNIQUE_VIOLATION,
          message: "Usuário já existe",
        });
      }

      return res
        .status(errorCodes.INTERNAL_SERVER)
        .json({ message: error.message });
    }
  }

  async update(req, res) {
    try {
      const { userId } = req.body.admParams;
      delete req.body.admParams.userId;
      const adm = await this.adm.update({
        where: { userId },
        data: {
          ...req.body.admParams,
          user: { update: { ...req.body.userParams } },
        },
        select: this.admProperties,
      });
      res.json({ message: "Adm atualizado.", payload: { adm } });
    } catch (error) {
      console.log(error);
      if (error.code === "P2002") {
        return res.status(errorCodes.CONFLICT).json({
          status: statusTypes.UNIQUE_VIOLATION,
          message: "Adm já existe.",
        });
      }
      if (error.code === "P2025") {
        return res
          .status(errorCodes.NOT_FOUND)
          .json({ message: "Adm não encontrado." });
      }

      return res
        .status(errorCodes.INTERNAL_SERVER)
        .json({ message: error.message });
    }
  }

  async disable(req, res) {
    try {
      await this.adm.update({
        where: { userId: +req.params.userId },
        data: {
          active: false,
        },
      });

      res.json({ message: "Adm desabilitado." });
    } catch (error) {
      if (error.code === "P2025") {
        return res
          .status(errorCodes.NOT_FOUND)
          .json({ message: "Adm não encontrado." });
      }

      return res
        .status(errorCodes.INTERNAL_SERVER)
        .json({ message: error.message });
    }
  }

  async enable(req, res) {
    try {
      await this.adm.update({
        where: { userId: +req.params.userId },
        data: {
          active: true,
        },
      });

      res.json({ message: "Adm habilitado." });
    } catch (error) {
      if (error.code === "P2025") {
        return res
          .status(errorCodes.NOT_FOUND)
          .json({ message: "Adm não encontrado." });
      }

      return res
        .status(errorCodes.INTERNAL_SERVER)
        .json({ message: error.message });
    }
  }
}

module.exports = AdmController;
