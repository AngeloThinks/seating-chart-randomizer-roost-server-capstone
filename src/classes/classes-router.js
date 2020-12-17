const express = require("express");
const xss = require("xss");
const logger = require("../logger");
const classesService = require("./classes-service");
const classesRouter = express.Router();
const bodyParser = express.json();

const serializeClasses = (classes) => ({
  id: xss(classes.id),
  name: xss(classes.name),
});

classesRouter
  .route("/")
  .get((req, res, next) => {
    const knex = req.app.get("db");
    classesService
      .getAllClasses(knex)
      .then((classes) => {res.json(classes.map(serializeClasses));
      })
      .catch(next);
  })
  .post(bodyParser, (req, res, next) => {
    for (const field of ["name"]) {
      if (!req.body[field]) {
        logger.error(`${field} is missing for classes post`);
        return res
          .status(400)
          .json({ error: { message: `${field} is missing` } });
      }
    }
    const newClasses = {
      name: req.body.name,
    };
    classesService
      .addClasses(req.app.get("db"), newClasses)
      .then((classes) => {
        logger.info(`Classes with id ${classes.id} created`);
        res.status(201).location(`/classes/${classes.id}`).json(classes);
      })
      .catch(next);
  });

module.exports = classesRouter;
