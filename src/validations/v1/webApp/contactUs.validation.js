const Joi = require('joi');
//const { password } = require('./custom.validation');

const contactUs = {
    body: Joi.object().keys({
        
    subject: Joi.string().required(),
    message: Joi.string().required(),
    enquiryType: Joi.string().valid("Dispute"),

    })
}

module.exports={contactUs};