const Joi = require('joi');
//const { password } = require('./custom.validation');

const contactUs = {
    body: Joi.object().keys({
    
    subject: Joi.string().required(),
    description: Joi.string().required(),
    enquiryType: Joi.string().valid("Dispute"),

    })
}

module.exports={contactUs};