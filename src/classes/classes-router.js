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
      .then((classes) => res.json(classes.map(serializeClasses)))
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
        // console.log("Classes", classes);
        logger.info(`Classes with id ${classes.id} created`);
        res.status(201).location(`/classes/${classes.id}`).json(classes);
      })
      .catch(next);
  });

classesRouter
  .route("/")
  .all((req, res, next) => {
    const { classes_id } = req.params;
    classesService
      .getClassesById(req.app.get("db"), classes_id)
      .then((Classes) => {
        if (!Classes) {
          logger.error(`Classes with id ${classes_id} not found`);
          return res
            .status(404)
            .json({ error: { message: "Class not found" } });
        }
        res.Classes = classes;
        next();
      })
      .catch(next);
  })
  .get((req, res, next) => {
    const classes = res.classes;
    res.json(serializeClasses(classes));
  });
//DELETE
classesRouter.route("/:id").delete((req, res, next) => {
  const { id } = req.params;

  classesService
    .deleteClasses(req.app.get("db"), id)
    .then(() => {
      logger.info(`Classes with id ${id} deleted`);
      return res.status(204).end();
    })
    .catch(next);
});
//PATCH classes request function
classesRouter
.route('/:id').patch(bodyParser, (req, res, next) => {
  const {name} = req.body;
  const {id} = req.params;
  const classesUpdates = {name};
  console.log(classesUpdates);

  if (Object.keys(classesUpdates).length == 0) {
    logger.info(`Classes must have values to update`);
    return res.status(400).json({
      error: { message: `patch request must supply values` },
    });
  }

  classesService
    .updateClasses(req.app.get("db"), id, classesUpdates)
    .then((updatedClasses) => {
      logger.info(`classes with id ${id} updated`);
      res.status(204).end();
    });
});

module.exports = classesRouter;
