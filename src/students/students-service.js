const studentsService = {
  getAllStudents(knex) {
    return knex.select("*").from("students");
  },
  getStudentsById(knex, id) {
    return knex.from("students").where("id", id).first();
  },
  addStudents(knex, students) {
    return knex
      .from("students")
      .insert(students)
      .into("students")
      .returning("*")
      .then((students) => students[0]);
  },
  deleteStudents(knex, id) {
    return knex.from("students").where("id", id).delete();
  },
  updateStudents(knex, id, students) {
    return knex.from("students").where("id", id).update(students);
  },
};

module.exports = studentsService;
