const knex = require("knex");
const app = require("../src/app");

describe("Teacher API:", function () {
  let db;
  let teachers = [
    {
    first_name: "John",
    last_name: "Doe",  
    email: "john@email.com",
    },
    {
    first_name: "1",
    last_name: "1",  
    email: "Biron",
    },
    {
    first_name: "1",
    last_name: "2",  
    email: "Hercules",
    },
    {
    first_name: "1",
    last_name: "2",  
    email: "August",
    },
    {
    first_name: "1",
    last_name: "2",  
    email: "Lurlene",
    },
  ];

  before("make knex instance", () => {
    db = knex({
      client: "pg",
      connection: 'postgresql://angelovazquez@localhost/roost_test_db',
    });
    app.set("db", db);
  });

  before("cleanup", () => db.raw("TRUNCATE TABLE teachers RESTART IDENTITY CASCADE;"));

  afterEach("cleanup", () =>
    db.raw("TRUNCATE TABLE teachers RESTART IDENTITY CASCADE;")
  );

  after("disconnect from the database", () => db.destroy());

  describe("GET all teachers", () => {
    beforeEach("insert some teachers", () => {
      return db("teachers").insert(teachers);
    });

    //relevant
    it("should respond to GET `/teachers` with an array of teachers and status 200", function () {
      return supertest(app)
        .get("/teachers")
        .expect(200)
        .expect((res) => {
          expect(res.body).to.be.a("array");
          expect(res.body).to.have.length(teachers.length);
          res.body.forEach((item) => {
            expect(item).to.be.a("object");
            expect(item).to.include.keys("id", "first_name", "last_name", "email");
          });
        });
    });
  });

  describe("GET teachers by id", () => {
    beforeEach("insert some teachers", () => {
      return db("teachers").insert(teachers);
    });

    it("should return correct teacher when given an id", () => {
      let doc;
      return db("teachers")
        .first()
        .then((_doc) => {
          doc = _doc;
          return supertest(app).get(`/teachers/${doc.id}`).expect(200);
        })
        .then((res) => {
          expect(res.body).to.be.an("object");
          expect(res.body).to.include.keys("id", "first_name", "last_name", "email");
          expect(res.body.id).to.equal(doc.id);
          expect(res.body.email).to.equal(doc.email);
        });
    });

    it("should respond with a 404 when given an invalid id", () => {
      return supertest(app).get("/teachers/aaaaaaaaaaaa").expect(404);
    });
  });

  describe("POST (create) new teacher", function () {
    //relevant
    it("should create and return a new teacher when provided valid data", function () {
      const newItem = {
        email: "Biology",
      };

      return supertest(app)
        .post("/teachers")
        .send(newItem)
        .expect(201)
        .expect((res) => {
          expect(res.body).to.be.a("object");
          expect(res.body).to.include.keys("id", "first_name", "last_name", "email", "last_names");
          expect(res.body.email).to.equal(newItem.email);
          expect(res.headers.location).to.equal(`/teachers/${res.body.id}`);
        });
    });

    it("should respond with 400 status when given bad data", function () {
      const badItem = {
        foobar: "broken item",
      };
      return supertest(app).post("/teachers").send(badItem).expect(400);
    });
  });

  describe("PATCH (update) teacher by id", () => {
    beforeEach("insert some teachers", () => {
      return db("teachers").insert(teachers);
    });

    //relevant
    it("should update item when given valid data and an id", function () {
      const item = {
        email: "American Teachers",
      };

      let doc;
      return db("teachers")
        .first()
        .then((_doc) => {
          doc = _doc;
          return supertest(app)
            .patch(`/teachers/${doc.id}`)
            .send(item)
            .expect(200);
        })
        .then((res) => {
          expect(res.body).to.be.a("object");
          expect(res.body).to.include.keys("id", "email");
          expect(res.body.email).to.equal(item.email);
        });
    });

    it("should respond with 400 status when given bad data", function () {
      const badItem = {
        foobar: "broken item",
      };

      return db("teachers")
        .first()
        .then((doc) => {
          return supertest(app)
            .patch(`/teachers/${doc.id}`)
            .send(badItem)
            .expect(400);
        });
    });

    it("should respond with a 404 for an invalid id", () => {
      const item = {
        email: "Invalid input",
      };
      return supertest(app)
        .patch("/teachers/aaaaaaaaaaaaaaaaaaaaaaaa")
        .send(item)
        .expect(404);
    });
  });

  describe("DELETE a teachers by id", () => {
    beforeEach("insert some teachers", () => {
      return db("teachers").insert(teachers);
    });

    //relevant
    it("should delete an item by id", () => {
      return db("teachers")
        .first()
        .then((doc) => {
          return supertest(app).delete(`/teachers/${doc.id}`).expect(204);
        });
    });

    it("should respond with a 404 for an invalid id", function () {
      return supertest(app)
        .delete("/teachers/aaaaaaaaaaaaaaaaaaaaaaaa")
        .expect(404);
    });
  });
});
