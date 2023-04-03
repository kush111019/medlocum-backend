const express = require('express');
const auth = require('../../../middlewares/auth');
const validate = require('../../../middlewares/validate');
const userValidation = require('../../../validations/v1/webApp/user.validation');
const userController = require('../../../controllers/v1/webApp/user.controller');

const router = express.Router();


// router.get('/specificCandidateOrClient',auth(),validate(userValidation.getSpecificCandidateOrClient),userController.getSpecificCandidateOrClient);

router.get('/specificJob',auth(),validate(userValidation.getSpecificJob),userController.getSpecificJob);

router.get('/specificCandidate',auth(),validate(userValidation.getSpecificCandidate),userController.getSpecificCandidate);


module.exports = router;
