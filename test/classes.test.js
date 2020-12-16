const knex = require("knex");
const app = require("../src/app");

describe("Class API:", function () {
  let db;
  let classes = [
    {
      name: "chemistry",
    },
    {
      name: "math",
    },
    {
      name: "english",
    },
    {
      name: "physics",
    },
    {
      name: "history",
    },
  ];

  before("make knex instance", () => {
    db = knex({
      client: "pg",
      connection: 'postgresql://angelovazquez@localhost/roost_test_db',
    });
    app.set("db", db);
  });

  before("cleanup", () => db.raw("TRUNCATE TABLE classes RESTART IDENTITY CASCADE;"));

  afterEach("cleanup", () =>
    db.raw("TRUNCATE TABLE classes RESTART IDENTITY CASCADE;")
  );

  after("disconnect from the database", () => db.destroy());

  describe("GET all classes", () => {
    beforeEach("insert some classes", () => {
      return db("classes").insert(classes);
    });

    //relevant
    it("should respond to GET `/classes` with an array of classes and status 200", function () {
      return supertest(app)
        .get("/classes")
        .expect(200)
        .expect((res) => {
          expect(res.body).to.be.a("array");
          expect(res.body).to.have.length(classes.length);
          res.body.forEach((item) => {
            expect(item).to.be.a("object");
            expect(item).to.include.keys("id", "name");
          });
        });
    });
  });

  // describe("GET classes by id", () => {
  //   beforeEach("insert some classes", () => {
  //     return db("classes").insert(classes);
  //   });

  //   it("should return correct class when given an id", () => {
  //     let doc;
  //     return db("classes")
  //       .first()
  //       .then((_doc) => {
  //         doc = _doc;

  //         return supertest(app).get(`/classes/${doc.id}`).expect(200);
  //       })
  //       .then((res) => {
  //         expect(res.body).to.be.an("object");
  //         expect(res.body).to.include.keys("id", "name");
  //         expect(res.body.id).to.equal(doc.id);
  //         expect(res.body.name).to.equal(doc.name);
  //       });
  //   });

  //   it("should respond with a 404 when given an invalid id", () => {
  //     return supertest(app).get("/classes/aaaaaaaaaaaa").expect(404);
  //   });
  // });

  describe("POST (create) new class", function () {
    //relevant
    it("should create and return a new class when provided valid data", function () {
      const newItem = {
        name: "Biology",
      };

      return supertest(app)
        .post("/classes")
        .send(newItem)
        .expect(201)
        .expect((res) => {
          expect(res.body).to.be.a("object");
          expect(res.body).to.include.keys("id", "name");
          expect(res.body.name).to.equal(newItem.name);
          expect(res.headers.location).to.equal(`/classes/${res.body.id}`);
        });
    });

    it("should respond with 400 status when given bad data", function () {
      const badItem = {
        foobar: "broken item",
      };
      return supertest(app).post("/classes").send(badItem).expect(400);
    });
  });

//   describe("PATCH (update) class by id", () => {
//     beforeEach("insert some classes", () => {
//       return db("classes").insert(classes);
//     });

//     //relevant
//     it("should update item when given valid data and an id", function () {
//       const item = {
//         name: "American Classes",
//       };

//       let doc;
//       return db("classes")
//         .first()
//         .then((_doc) => {
//           doc = _doc;
//           return supertest(app)
//             .patch(`/classes/${doc.id}`)
//             .send(item)
//             .expect(200);
//         })
//         .then((res) => {
//           expect(res.body).to.be.a("object");
//           expect(res.body).to.include.keys("id", "name");
//           expect(res.body.name).to.equal(item.name);
//         });
//     });

//     it("should respond with 400 status when given bad data", function () {
//       const badItem = {
//         foobar: "broken item",
//       };

//       return db("classes")
//         .first()
//         .then((doc) => {
//           return supertest(app)
//             .patch(`/classes/${doc.id}`)
//             .send(badItem)
//             .expect(400);
//         });
//     });

//     it("should respond with a 404 for an invalid id", () => {
//       const item = {
//         name: "Invalid input",
//       };
//       return supertest(app)
//         .patch("/classes/aaaaaaaaaaaaaaaaaaaaaaaa")
//         .send(item)
//         .expect(404);
//     });
//   });

//   describe("DELETE a classes by id", () => {
//     beforeEach("insert some classes", () => {
//       return db("classes").insert(classes);
//     });

//     //relevant
//     it("should delete an item by id", () => {
//       return db("classes")
//         .first()
//         .then((doc) => {
//           return supertest(app).delete(`/classes/${doc.id}`).expect(204);
//         });
//     });

//     it("should respond with a 404 for an invalid id", function () {
//       return supertest(app)
//         .delete("/classes/aaaaaaaaaaaaaaaaaaaaaaaa")
//         .expect(404);
//     });
//   });
});
