require('dotenv').config();

const app = require('./app.js');
const { PORT, API_URL } = require('./config');
const knex = require("knex");

const db = knex({
    client: "pg",
    connection: API_URL,
});

app.set('db', db);

app.listen(PORT, ()=> {
    console.log(`Server listening at http://localhost:${PORT}`)

});

