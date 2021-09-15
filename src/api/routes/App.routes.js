module.exports = (app) => {
    app.get("/", (_, res) => {
        res.send({ app: "SAPEP", date: new Date() });
    });
};
