const express = require('express');
const jobRequestController = require('../../../controllers/v1/webApp/jobRequest.controller');
const router = express.Router();
const validate = require('../../../middlewares/validate');
const jobRequestValidation = require('../../../validations/v1/webApp/jobRequest.validation');
const auth = require('../../../middlewares/auth');

router.post('/create',auth(),validate(jobRequestValidation.createJobRequest),jobRequestController.createJobRequest);

router.patch('/:jobRequestId',auth(),validate(jobRequestValidation.updateJobRequest),jobRequestController.updateJobRequest);

router.delete('/:jobRequestId1',auth(),validate(jobRequestValidation.deleteJobRequest),jobRequestController.deleteJobRequest);


module.exports=router;

