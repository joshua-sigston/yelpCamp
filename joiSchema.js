const Joi = require('joi')

module.exports.joiCampgroundSchema = Joi.object({
    campground: Joi.object({
        title: Joi.string().required(), 
        price: Joi.number().required().min(0),
        image: Joi.any().required(),
        location: Joi.string().required(),
        description: Joi.string().required()
    }).required()
});

module.exports.reviewCampgroundSchema = Joi.object({
    review: Joi.object({
        rating: Joi.number().required().min(1).max(5),
        body: Joi.string().required()
    }).required()
})
