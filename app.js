const express = require('express');
const app = express();
const session = require('express-session');
const methodOverrid = require('method-override');
const ejsMate = require('ejs-mate');
const path = require('path');
const mongoose = require('mongoose');
const flash = require('connect-flash')
const passport = require('passport')
const LocalStrategy = require('passport-local')
const User = require('./models/user')

const PORT = 3000;

// routes
const campgrounds = require('./routes/campgrounds')
const reviews = require('./routes/reviews')
const user = require('./routes/users')

//Utils
const ExpressError = require('./utils/expressError');

// Joi
const {joiCampgroundSchema, reviewCampgroundSchema} = require('./joiSchema.js')

// Models
const Campground = require('./models/campground');
const Review = require('./models/reviews')


mongoose.connect('mongodb://127.0.0.1:27017/yelp-camp')
    .then(() => {
        console.log('connection successfull!')
    })
    .catch(err => {
        console.log(err)
    });

app.engine('ejs', ejsMate)

// app.set
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// app.use
app.use(express.urlencoded({ extended: true }));
app.use(methodOverrid('_method'));
app.use(express.static('public'))

const sessionConfig = {
    secret: 'secret',
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
}
app.use(session(sessionConfig))
app.use(flash())
// auth
app.use(passport.initialize())
app.use(passport.session())
passport.use(new LocalStrategy(User.authenticate()))
passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())

// Middleware
app.use((req, res, next) => {
    res.locals.currentUser = req.user;
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
});


// route handlers
app.use('/campgrounds', campgrounds);
app.use('/campgrounds/:id/reviews', reviews);
app.use('/', user)

// get routes
app.get('/', (req, res) => {
    res.render('home')
});

// all routes
app.all('*', (req, res, next) => {
    next(new ExpressError('Page Not Found', 404))
});

// next
app.use((err, req, res, next) => {
    const  { statusCode=500 } = err;
    if(!err.message) err.message = 'Error!';
    res.status(statusCode).render('error', { err });
    res.send('error!');
});

app.listen(PORT, () => {console.log(`app is listening on port ${PORT}`)})