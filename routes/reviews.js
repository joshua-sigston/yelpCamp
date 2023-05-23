const express = require('express')
const router = express.Router({mergeParams: true})

//Utils
const catchAsync = require('../utils/catchAsync')

// Models
const Campground = require('../models/campground');
const Review = require('../models/reviews')

// Middleware
const { validateReview, isLoggedIn, isReviewAuthor } =require('../middleware')

// Controllers 
const reviews = require('../controllers/reviews')

router.post('/',isLoggedIn, validateReview, catchAsync(reviews.create))

router.delete('/:reviewId',isLoggedIn, isReviewAuthor, catchAsync(reviews.delete))

module.exports = router;