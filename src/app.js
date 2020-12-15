const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const helmet = require('helmet');
const { NODE_ENV } = require('./config');
const studentsRouter = require('./students/students-router'); 
const teachersRouter = require('./teachers/teachers-router');
const classesRouter = require('./classes/classes-router');

const app = express();

const morganOptn = (NODE_ENV === 'production') ? 'tiny' : 'common';

app.use(express.static('public'))
app.use(morgan(morganOptn));
app.use(helmet());
app.use(cors());
app.use('/students',studentsRouter);
app.use('/teachers',teachersRouter);
app.use('/classes',classesRouter);

// routes ::::::::
app.get('/', (req, res)=>{
	console.log("app.get in app.js route")
	res.status(200).end();
});

//generic error handler
app.use( (error, req, res, next) =>{
	let response = null;
 	if ( NODE_ENV === 'production' ) {
		response = { message : 'server error' };
	} else {
		console.log(error);
		response = { error, message : error.message };
	}
	res.json(response);
});


module.exports = app;
