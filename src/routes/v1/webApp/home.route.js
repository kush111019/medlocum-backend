const express = require('express');
const jobDetailsController = require('../../../controllers/v1/webApp/job.details.controller');
const userController = require('../../../controllers/v1/webApp/user.controller');
const router = express.Router();
const validate = require('../../../middlewares/validate');
const auth = require('../../../middlewares/auth');
const userValidation = require('../../../validations/v1/webApp/jobDetails.validation');

router.get('/candidate',auth(),userController.candidateHomePage);
router.get('/client',auth(),userController.clientHomePage)

router.get('/fullClientHomePage',auth(),userController.clientHomePage);
router.get('/fullCandidatePage',auth(),userController.candidateHomePage)

router.get('/filteredCandidates',auth(),userController.matchedCandidatesForClientHomePage)

router.get('/filteredClients',auth(),userController.matchedClientsForCandidateHomePage);

module.exports=router;