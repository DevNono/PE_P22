'use strict';
const createError = require('http-errors');
const express = require('express');
const {body, validationResult} = require('express-validator');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const compression = require('compression');
const cors = require('cors');

const indexRouter = require('../routes/index');
const usersRouter = require('../routes/users');
const coursesRouter = require('../routes/courses');

const app = express();

// View engine setup
app.set('views', path.join(__dirname, '../resources/views'));
app.set('view engine', 'twig');

app.use(logger('dev'));
app.use(express.json());

const helmet = require('helmet');
app.use(helmet({
	contentSecurityPolicy: false,
}));

app.use(compression());

app.use(express.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, '../public')));
app.use(cors());

// Routes
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/courses', coursesRouter);

// Catch 404 and forward to error handler
app.use((req, res, next) => {
	next(createError(404));
});

// Error handler
app.use((err, req, res) => {
	// Set locals, only providing error in development
	res.locals.message = err.message;
	res.locals.error = req.app.get('env') === 'development' ? err : {};

	// Render the error page
	res.status(err.status || 500);
	res.render('error');
});

module.exports = app;
