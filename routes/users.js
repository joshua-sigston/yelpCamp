const express = require('express')
const router = express.Router()
const User = require('../models/user')
const catchAsync = require('../utils/catchAsync')
const passport = require('passport')
const {storeReturnTo} = require('../middleware')

// Controller
const user = require('../controllers/users')

// render form
router.get('/register', user.register_form)

// post new register
router.post('/register', catchAsync(user.register))

// render login form
router.get('/login', user.login_form)

// post log in
router.post('/login', storeReturnTo, passport.authenticate('local', {failureFlash: true, failureRedirect: '/login'}), user.login)

// logout
router.get('/logout', user.logout); 

module.exports = router