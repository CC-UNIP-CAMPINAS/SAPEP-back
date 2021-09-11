const database = require("../services/sequelize/models");

class GroupController {
  static async getAll(req, res) {
    try {
      const allGroups = await database.Group.findAll();
      return res.status(200).json(allGroups);
    } catch (error) {
      return res.status(500).json(error.message);
    }
  }
}

module.exports = GroupController;
