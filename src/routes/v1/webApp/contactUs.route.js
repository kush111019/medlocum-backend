const express = require('express');
const router = express.Router();
const validate = require('../../../middlewares/validate');
const auth = require('../../../middlewares/auth');
const contactUsController = require('../../../controllers/v1/webApp/contactUs.controller');
const contactUsValidation=require('../../../validations/v1/webApp/contactUs.validation');


router.post('/',auth(),validate(contactUsValidation.contactUs),contactUsController.contactUs);


module.exports = router;