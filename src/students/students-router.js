const express = require("express");
const xss = require("xss");
const logger = require("../logger");
const studentsService = require("./students-service");
const studentsRouter = express.Router();
const bodyParser = express.json();

const serializeStudent = (students) => ({
  id: students.id,
  teachers_id: students.teachers_id,
  classes_id: students.classes_id,
  first_name: xss(students.first_name),
  last_name: xss(students.last_name),
});

//getAllStudents Router
studentsRouter
  .route("/")
  .get((req, res, next) => {
    const knex = req.app.get("db");
    studentsService
      .getAllStudents(knex)
      .then((students) => {
        console.log(students);
        res.json(students.map(serializeStudent));
      })
      .catch(next);
  })

  //Post request
  .post(bodyParser, (req, res, next) => {
    for (const field of [
      "teachers_id",
      "classes_id",
      "first_name",
      "last_name",
    ]) {
      if (!req.body[field]) {
        logger.error(`${field} is missing`);
        return res
          .status(400)
          .json({ error: { message: `${field} is missing` } });
      }
    }
    const newStudent = {
      teachers_id: req.body.teachers_id,
      classes_id: req.body.classes_id,
      first_name: req.body.first_name,
      last_name: req.body.last_name,
    };
    studentsService
      .addStudents(req.app.get("db"), newStudent)
      .then((students) => {
        logger.info(`student with id ${students.id} created`);
        res.status(201).location(`/students/${students.id}`).json(students);
      })
      .catch(next);
  });

studentsRouter
  .route("/:students_id")
  .all((req, res, next) => {
    const { students_id } = req.params;
      if(!parseInt(students_id))
      return res.status(404)
                .json({ error: { message: "id must be an integer" } });
      studentsService
      .getStudentsById(req.app.get("db"), students_id)
      .then((students) => {
        if (!students) {
          logger.error(`Student with id ${students_id} not found`);
          return res
            .status(404)
            .json({ error: { message: "student not found" } });
        }
        res.students = students;
        next();
      })
      .catch(next);
  })
  .get((req, res, next) => {
    const students = res.students;
    res.json(serializeStudent(students));
  })

  //DELETE students function
  .delete((req, res, next) => {
    const { students_id } = req.params;

    studentsService
      .deleteStudents(req.app.get("db"), students_id)
      .then(() => {
        logger.info(`student with id ${students_id} deleted`);
        res.status(204).end();
      })
      .catch(next);
  })

// randomize method/function
studentsRouter
  .route("/randomize/:classes_id")
  .get((req, res, next) => {
    const { classes_id } = req.params;

    studentsService
      .getStudentsByClassesId(req.app.get("db"), classes_id)
      .then((students) => {
        if (!students) {
          logger.error(`Student with id ${classes_id} not found`);
          return res
            .status(404)
            .json({ error: { message: "student not found" } });
        }
        res.json(students.rows.map(serializeStudent));

      })
      .catch(next);
  })
  

module.exports = studentsRouter;
