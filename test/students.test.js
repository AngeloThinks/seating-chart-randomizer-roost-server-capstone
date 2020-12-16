const knex = require("knex");
const app = require("../src/app");

describe("Student API:", function () {
  let db;
  let students = [
    {
    teachers_id: 1,
    classes_id: 1,  
    first_name: "Deb",
    last_name: "Pillington"
    },
    {
    teachers_id: 1,
    classes_id: 1,  
    first_name: "Biron",
    last_name: "Doge"
    },
    {
    teachers_id: 1,
    classes_id: 2,  
    first_name: "Hercules",
    last_name: "Langtree"
    },
    {
    teachers_id: 1,
    classes_id: 2,  
    first_name: "August",
    last_name: "Aird"
    },
    {
    teachers_id: 1,
    classes_id: 2,  
    first_name: "Lurlene",
    last_name: "Sweatman"
    },
  ];
  let teachers = [
    {
    first_name: "John",
    last_name: "Doe",  
    email: "john@email.com",
    },
  ];
  let classes = [
  {
    name: "chemistry",
  },
  {
    name: "math",
  },
];

  before("make knex instance", () => {
    db = knex({
      client: "pg",
      connection: 'postgresql://angelovazquez@localhost/roost_test_db',
    });
    app.set("db", db);
  });

  before("cleanup", () => db.raw("TRUNCATE TABLE teachers, classes, students RESTART IDENTITY CASCADE;"));

  afterEach("cleanup", () =>
    db.raw("TRUNCATE TABLE teachers, classes, students RESTART IDENTITY CASCADE;")
  );

  after("disconnect from the database", () => db.destroy());

  describe("GET all students", () => {
    beforeEach("insert some teachers", () => {
      return db("teachers").insert(teachers);
    });
    beforeEach("insert some classes", () => {
      return db("classes").insert(classes);
    });
    beforeEach("insert some students", () => {
      return db("students").insert(students);
    });

    //relevant
    it("should respond to GET `/students` with an array of students and status 200", function () {
      return supertest(app)
        .get("/students")
        .expect(200)
        .expect((res) => {
          expect(res.body).to.be.a("array");
          expect(res.body).to.have.length(students.length);
          res.body.forEach((item) => {
            expect(item).to.be.a("object");
            expect(item).to.include.keys("teachers_id", "classes_id", "first_name", "last_name");
          });
        });
    });
  });

  // describe("GET students by id", () => {
    beforeEach("insert some teachers", () => {
      return db("teachers").insert(teachers);
    });
    beforeEach("insert some classes", () => {
      return db("classes").insert(classes);
    });
    beforeEach("insert some students", () => {
      return db("students").insert(students);
    });

    it("should return correct student when given an id", () => {
      let doc;
      return db("students")
        .first()
        .then((_doc) => {
          doc = _doc;
          return supertest(app).get(`/students/${doc.id}`).expect(200);
        })
        .then((res) => {
          console.log(res.body, "LOOK HERE RES.BODY")
          console.log(doc, "DOCTOR TIME")
          expect(res.body).to.be.an("object");
          expect(res.body).to.include.keys("teachers_id", "classes_id", "first_name", "last_name");
          expect(res.body.id).to.equal(doc.id);
          expect(res.body.teachers_id).to.equal(doc.teachers_id);
          expect(res.body.classes_id).to.equal(doc.classes_id);
          expect(res.body.first_name).to.equal(doc.first_name);
          expect(res.body.last_name).to.equal(doc.last_name);
        });
    });

    it("should respond with a 404 when given an invalid id", () => {
      return supertest(app).get("/students/aaaaaaaaaaaa").expect(404);
    });
  });

  describe("POST (create) new student", function () {
    //relevant
    it("should create and return a new student when provided valid data", function () {
      const newItem = {
        teachers_id: 1,
        classes_id: 2,
        first_name: "Patrick",
        last_name: "Star",
      };

      return supertest(app)
        .post("/students")
        .send(newItem)
        .expect(201)
        .expect((res) => {
          expect(res.body).to.be.a("object");
          expect(res.body).to.include.keys("teachers_id", "classes_id", "first_name", "last_name");
          expect(res.body.first_name).to.equal(newItem.first_name);
          expect(res.headers.location).to.equal(`/students/${res.body.id}`);
        });
    });

    it("should respond with 400 status when given bad data", function () {
      const badItem = {
        foobar: "broken item",
      };
      return supertest(app).post("/students").send(badItem).expect(400);
    });
  });

  describe("PATCH (update) student by id", () => {
    beforeEach("insert some students", () => {
      return db("students").insert(students);
    });

    //relevant
    it("should update item when given valid data and an id", function () {
      const item = {
        teachers_id: 1,
        classes_id: 1,  
        first_name: "Deb",
        last_name: "Pillington"
      };

      let doc;
      return db("students")
        .first()
        .then((_doc) => {
          doc = _doc;
          return supertest(app)
            .patch(`/students/${doc.id}`)
            .send(item)
            .expect(200);
        })
        .then((res) => {
          expect(res.body).to.be.a("object");
          expect(res.body).to.include.keys("teachers_id", "classes_id", "first_name", "last_name");
          expect(res.body.teachers_id).to.equal(doc.teachers_id);
          expect(res.body.classes_id).to.equal(doc.classes_id);
          expect(res.body.first_name).to.equal(doc.first_name);
          expect(res.body.last_name).to.equal(doc.last_name);
        });
    });

    it("should respond with 400 status when given bad data", function () {
      const badItem = {
        foobar: "broken item",
      };

      return db("students")
        .first()
        .then((doc) => {
          return supertest(app)
            .patch(`/students/${doc.id}`)
            .send(badItem)
            .expect(400);
        });
    });

    it("should respond with a 404 for an invalid id", () => {
      const item = {
        first_name: "Invalid input",
      };
      return supertest(app)
        .patch("/students/aaaaaaaaaaaaaaaaaaaaaaaa")
        .send(item)
        .expect(404);
    });
  });

  describe("DELETE a students by id", () => {
    beforeEach("insert some students", () => {
      return db("students").insert(students);
    });

    //relevant
    it("should delete an item by id", () => {
      return db("students")
        .first()
        .then((doc) => {
          return supertest(app).delete(`/students/${doc.id}`).expect(204);
        });
    });

    it("should respond with a 404 for an invalid id", function () {
      return supertest(app)
        .delete("/students/aaaaaaaaaaaaaaaaaaaaaaaa")
        .expect(404);
    });
  });
// });
