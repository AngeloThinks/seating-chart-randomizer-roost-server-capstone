const studentsService = {
  getAllStudents(knex) {
    return knex.select("*").from("students");
  },
  getStudentsById(knex, id) {
    return knex.from("students").where("id", id).first();
  },

  getStudentsByClassesId(knex, classes_id) {
    // knex raw is sql query which needs to be excuted by knex without any shortcuts (ex:.select('*') .where('recipes.id', recipes_id))
    return knex.raw(`
      SELECT	
          *
      FROM 
        students
      WHERE 
        classes_id = ${classes_id}
      ORDER BY
        random();
      `);
  },
  //in the front-end you will make a API call with the url exactly from postman student randomize - This will be the endpoint

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
