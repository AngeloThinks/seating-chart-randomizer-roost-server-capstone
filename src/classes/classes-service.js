const classesService = {
    getAllClasses(knex) {
        return knex.select("*").from("classes");
    },
    getClassesById(knex, id) {
        return knex.from("classes").where("id", id).first();
    },
    addClasses(knex, classes) {
        return knex
            .from("classes")
            .insert(classes)
            .returning("*")
            .then((classes) => classes[0]);
    },
    deleteClasses(knex, id) {
        return knex.from("classes").where("id", id).delete();
    },
    updateClasses(knex, id, classes) {
        return knex.from("classes").where("id", id).update(classes);
    },
};

module.exports = classesService;