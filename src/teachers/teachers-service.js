// const teachersService = {
//   getAllTeachers(knex) {
//     return knex.select("*").from("teachers");
//   },
//   getTeachersById(knex, id) {
//     return knex.from("teachers").where("id", id).first();
//   },
//   addTeachers(knex, teachers) {
//     // console.log(teachers, "teachers-service");
//     return knex
//       .from("teachers")
//       .insert(teachers)
//       .returning("*")
//       .then((teachers) => teachers[0]);
//   },
//   deleteTeachers(knex, id) {
//     return knex.from("teachers").where("id", id).delete();
//   },
//   updateTeachers(knex, id, teachers) {
//     return knex.from("teachers").where("id", id).update(teachers);
//   }, 
// };

// module.exports = teachersService;
const teachersService = {
  getAllTeachers(knex) {
    return knex.select("*").from("teachers");
  },
  getTeachersById(knex, id) {
    return knex.from("teachers").where("id", id).first();
  },
  addTeachers(knex, teachers) {
    // console.log(teachers, "teachers-service");
    return knex
      .from("teachers")
      .insert(teachers)
      .returning("*")
      .then((teachers) => teachers[0]);
  },
  deleteTeachers(knex, id) {
    return knex.from("teachers").where("id", id).delete();
  },
  updateTeachers(knex, id, teachers) {
    return knex.from("teachers").where("id", id).update(teachers);
  },
};

module.exports = teachersService;
