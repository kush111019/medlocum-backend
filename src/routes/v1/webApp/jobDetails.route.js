const express = require('express');
const jobDetailsController = require('../../../controllers/v1/webApp/jobDetails.controller');
const router = express.Router();
const validate = require('../../../middlewares/validate');
const auth = require('../../../middlewares/auth');
const jobDetailsValidation = require('../../../validations/v1/webApp/jobDetails.validation');

router.post('/',auth(),validate(jobDetailsValidation.createJobDetails), jobDetailsController.createJobDetails);

router.patch('/:jobId',auth(),validate(jobDetailsValidation.updateJobDetails),jobDetailsController.updateJobDetails);

router.delete('/:jobId',auth(),validate(jobDetailsValidation.deleteJobDetails),jobDetailsController.deleteJobDetails);

router.get('/filterJobDetails',auth(),validate(jobDetailsValidation.filterJobDetails),jobDetailsController.filterJobDetails);

router.get('/jobDetailsForBoth',auth(),validate(jobDetailsValidation.getJobListByClientId),jobDetailsController.getJobListForBoth);


module.exports = router
