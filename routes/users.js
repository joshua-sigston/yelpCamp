const express = require('express')
const router = express.Router()
const User = require('../models/user')
const catchAsync = require('../utils/catchAsync')
const passport = require('passport')
const {storeReturnTo} = require('../middleware')

// render form
router.get('/register', (req, res) => {
    res.render('users/register');
})

// post new register
router.post('/register', catchAsync(async (req, res) => {
    try {
        const { email, username, password } = req.body;
        const user = new User({ email, username });
        const registerUser = await User.register(user, password);
        req.login(registerUser, err => {
            if(err) return next();
            req.flash('success', 'Welcome to yelpcamp;');
            res.redirect('/campgrounds');
        });
    } catch (error) {
        req.flash('error', error.message)
        res.redirect('/register')
    }
}))

// render login form
router.get('/login', (req, res) => {
    res.render('users/login')
})

// post log in
router.post('/login', storeReturnTo, passport.authenticate('local', {failureFlash: true, failureRedirect: '/login'}), (req, res) => {
    req.flash('success', 'Welcome Back');
    const redirectUrl = res.locals.returnTo || '/campgrounds';
    delete req.session.returnTo;
    res.redirect(redirectUrl)
})

// logout
router.get('/logout', (req, res, next) => {
    req.logout(function (err) {
        if (err) {
            return next(err);
        }
        req.flash('success', 'Goodbye!');
        res.redirect('/campgrounds');
    });
}); 

module.exports = router