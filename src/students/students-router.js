const express = require("express");
const xss = require("xss");
const logger = require("../logger");
const studentsService = require("./students-service");
const studentsRouter = express.Router();
const bodyParser = express.json();

const serializeStudent = (students) => ({
  id: xss(students.id),
  teachers_id: xss(students.teachers_id),
  classes_id: xss(students.classes_id),
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
    // console.log(req.body);
    const newStudent = {
      teachers_id: req.body.teachers_id,
      classes_id: req.body.classes_id,
      first_name: req.body.first_name,
      last_name: req.body.last_name,
    };
    // console.log(newStudent,'new student router')
    studentsService
      .addStudents(req.app.get("db"), newStudent)
      .then((students) => {
        // console.log("student", students);
        logger.info(`student with id ${students.id} created`);
        res.status(201).location(`/students/${students.id}`).json(students);
      })
      .catch(next);
  });

studentsRouter
  .route("/:students_id")
  .all((req, res, next) => {
    const { students_id } = req.params;
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

  //delet students function
  .delete((req, res, next) => {
    const { students_id } = req.params;

    studentsService
      .deleteStudent(req.app.get("id"), students_id)
      .then(() => {
        logger.info(`student with id ${students_id} deleted`);
        res.status(204).end();
      })
      .catch(next);
  })
  //PATCH students request function
  .patch(bodyParser, (req, res, next) => {
    const { teachers_id, classes_id, first_name, last_name } = req.body;
    const { students_id } = req.params;
    const studentsUpdates = {
      id: students_id,
      teachers_id,
      classes_id,
      first_name,
      last_name,
    };
    console.log("studentsUpdates", studentsUpdates);

    if (Object.keys(studentsUpdates).length == 0) {
      logger.info(`student must have values to update`);
      return res.status(400).json({
        error: { message: `patch request must supply values` },
      });
    }
    studentsService
      .updateStudents(req.app.get("db"), students_id, studentsUpdates)
      .then((updatedStudent) => {
        logger.info(`student with id ${students_id} updated`);
        res.status(204).end();
      });
  });

// randomize method/function
//remove teachers_id from randomize
studentsRouter
  .route("/randomize/:classes_id")
  .get((req, res, next) => {
    console.log("HELLO THERE")
    const { classes_id } = req.params;
    console.log(classes_id, "This is the classes");

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
