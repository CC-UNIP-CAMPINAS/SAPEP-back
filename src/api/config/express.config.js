const express = require("express");

const app = express();

const errorCodes = {
  OK: 200,
  BAD_REQUEST: 400,
  NOT_AUTHORIZED: 401,
  NOT_FOUND: 404,
  INTERNAL_SERVER: 500,
};

const statusTypes = {
  OK: "OK",
  FIELD_EMPTY: "FIELD_EMPTY",
  NOT_AUTHORIZED: "NOT_AUTHORIZED",
  SERVER_ERROR: "SERVER_ERROR",
  NOT_FOUND: "NOT_FOUND",
  SUCCESS: "SUCCESS",
  LOGOFF: "LOGOFF",
};

async function startApi() {
  //CORS POLICIES
  app.use(
    require("cors")({
      credentials: true,
      origin: [process.env.FRONT_URL],
      optionsSuccessStatus: 200,
    })
  );

  //HELMET
  app.use(require("helmet")());

  //PARSER x-www-form-urlencoded
  app.use(express.urlencoded({ extended: true }));
  app.use(express.json({ limit: 2e6 }));

  //LOAD ROUTES
  app.use(require("../routes/App.routes"));
  app.use(require("../routes/Group.routes"));

  app.listen(process.env.PORT, () => {
    console.log("Servidor ouvindo na porta: " + process.env.PORT);
  });
}

module.exports = {startApi, errorCodes, statusTypes};
