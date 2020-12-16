const express = require("express");
const xss = require("xss");
const logger = require("../logger");
const teachersService = require("./teachers-service");
const teachersRouter = express.Router();
const bodyParser = express.json();

const serializeTeacher = (teachers) => ({
  id: xss(teachers.id),
  first_name: xss(teachers.first_name),
  last_name: xss(teachers.last_name),
  email: xss(teachers.email),
});

teachersRouter
  .route("/")
  .get((req, res, next) => {
    const knex = req.app.get("db");
    teachersService
      .getAllTeachers(knex)
      .then((teachers) => {
        console.log(teachers);
        res.json(teachers.map(serializeTeacher));
      })
      .catch(next);
  })
  .post(bodyParser, (req, res, next) => {
    for (const field of ["first_name", "last_name", "email"]) {
      if (!req.body[field]) {
        logger.error(`${field} is missing for teachers post`);
        return res
          .status(400)
          .json({ error: { message: `${field} is missing` } });
      }
    }
    // console.log(req.body);
    const newteacher = {
      first_name: req.body.first_name,
      last_name: req.body.last_name,
      email: req.body.email,
    };
    // console.log(newteacher,'teachers-router')
    teachersService
      .addTeachers(req.app.get("db"), newteacher)
      .then((teachers) => {
        // console.log("teacher", teachers);
        logger.info(`teacher with id ${teachers.id} created`);
        res.status(201).location(`/teachers/${teachers.id}`).json(teachers);
      })
      .catch(next);
  });

teachersRouter
  .route("/")
  .all((req, res, next) => {
    const { teachers_id } = req.params;
    teachersService
      .getTeachersById(req.app.get("db"), teachers_id)
      .then((teachers) => {
        if (!teachers) {
          logger.error(`Teacher with id ${teachers_id} not found`);
          return res
            .status(404)
            .json({ error: { message: "Teacher not found" } });
        }
        res.teachers = teachers;
        next();
      })
      .catch(next);
  })
  .get((req, res, next) => {
    const teachers = res.teachers;
    res.json(serializeTeachers(teachers));
  });

//DELETE Teachers function
teachersRouter.route("/:id").delete((req, res, next) => {
  const { id } = req.params;

  teachersService
    .deleteTeachers(req.app.get("db"), id)
    .then(() => {
      // console.log("teachers", teachers_id);
      logger.info(`Teachers with id ${id} deleted`);
      return res.status(204).end();
    })
    .catch(next);
});
//PATCH teachers request function
teachersRouter
.route('/:id').patch(bodyParser, (req, res, next) => {
  const {first_name, last_name, email} = req.body;
  const {id} = req.params;
  const teachersUpdates = {first_name, last_name, email}
  console.log(teachersUpdates);

  if (Object.keys(teachersUpdates).length == 0) {
    logger.info(`Teachers must have values to update`);
    return res.status(400).json({
      error: { message: `patch request must supply values` },
    });
  }

teachersService
    .updateTeachers(req.app.get("db"), id, teachersUpdates)
    .then((updatedTeacher) => {
      logger.info(`teacher with id ${id} updated`);
      res.status(204).json(updatedTeacher);
    });
});

module.exports = teachersRouter;
