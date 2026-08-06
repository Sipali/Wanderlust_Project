const joi = require("joi");

module.exports.listingSchema = joi.object({
    listing: joi.object({
        title: joi.string().required(),
        description: joi.string().required(),
        location: joi.string().required(),
        country: joi.string().required(),
        price: joi.string().required(),
        category: joi.string().allow('', null),
        image: joi.string().allow('', null)
    }).required(),
});

module.exports.reviewSchema = joi.object({
    review: joi.object({
        rating: joi.number().required().min(0).max(5),
        comment: joi.string().required(),
    }).required(),
});