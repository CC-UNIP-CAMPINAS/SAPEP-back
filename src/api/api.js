const express = require("express");

const app = express();

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
  app.use(require("./controllers/App.routes"));

  app.listen(process.env.PORT, () => {
    console.log("Servidor ouvindo na porta: " + process.env.PORT);
  });
}

module.exports = startApi;
