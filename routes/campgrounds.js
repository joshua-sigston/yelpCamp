const express = require('express')
const router = express.Router()

//Utils
const catchAsync = require('../utils/catchAsync')

// Models
const Campground = require('../models/campground');

// Middleware
const {isLoggedIn, validateCampground, isAuthor} =require('../middleware')

// Controllers
const campgrounds = require('../controllers/campgrounds')

// campground index
router.get('/', catchAsync(campgrounds.index))

// submit new camp
router.get('/submit-camp', isLoggedIn, campgrounds.submit_page);

// create new campground's page
router.post('/', isLoggedIn, validateCampground, catchAsync(campgrounds.create))

// campground details
router.get('/:id', catchAsync(campgrounds.details));

// edit campground page
router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(campgrounds.edit_page));

// edit campground
router.put('/:id', isLoggedIn, isAuthor, validateCampground, catchAsync(campgrounds.submit_edit))


// delete campground
router.delete('/:id', isLoggedIn, isAuthor, catchAsync(campgrounds.delete));

module.exports = router;