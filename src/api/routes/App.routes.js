const { Router } = require("express");

const route = Router();

route.get("/", (req, res) => {
  res.send({ app: "SAPEP", date: new Date() });
});

module.exports = route;
