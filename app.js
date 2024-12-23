require('dotenv').config();

const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const createError = require('http-errors');
const cors = require('cors');
const passport = require('passport');
const handlebars = require('hbs');
const helpers = require('handlebars-helpers')();
const jwt = require('jsonwebtoken');

const indexRouter = require('./app_server/routes/index');
const usersRouter = require('./app_server/routes/users');
const travelRouter = require('./app_server/routes/travel');
const authRoutes = require('./app_server/routes/auth');
const apiRouter = require('./app_api/routes/index');
const reservationsRouter = require('./app_api/routes/reservations');
const newsRouter = require('./app_server/routes/news');

const app = express();

// View engine setup
app.set('views', path.join(__dirname, 'app_server', 'views'));
app.set('view engine', 'hbs');
handlebars.registerPartials(path.join(__dirname, 'app_server', 'views', 'partials'));
handlebars.registerHelper(helpers);

require('./app_api/models/db');
require('./app_api/config/passport');
require('./app_api/models/user');

// Middleware
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(passport.initialize());

app.use((req, res, next) => {
    const token = req.cookies.token;
    if (token) {
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            res.locals.user = decoded;
            console.log(`User logged in: ${decoded.email}`);
        } catch (err) {
            console.error('Invalid token:', err.message);
            res.locals.user = null;
        }
    } else {
        res.locals.user = null;
    }
    next();
});

app.use(cors({ origin: ['http://localhost:4200', 'http://localhost:3000'], methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], credentials: true, }));

// Routes
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/travel', travelRouter);
app.use('/auth', authRoutes);
app.use('/api', apiRouter);
app.use('/reservations', reservationsRouter);
app.use('/news', newsRouter);

// Error handling
app.use((err, req, res, next) => {
    if (err.name === 'UnauthorizedError') {
        return res.status(401).json({ message: `${err.name}: ${err.message}` });
    }
    next(err);
});
app.use((req, res, next) => next(createError(404)));
app.use((err, req, res, next) => {
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};
    res.status(err.status || 500);
    res.render('error');
});

module.exports = app;
