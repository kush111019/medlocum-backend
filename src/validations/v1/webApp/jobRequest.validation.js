const Joi = require('joi');
const { password, objectId } = require('./custom.validation');


const createJobRequest = {
    body: Joi.object().keys({
      clientId: Joi.string().required().custom(objectId),
      jobId: Joi.string().required().custom(objectId),
      
    })
  };


  const updateJobRequest = {
  
    body: Joi.object()
      .keys({
      candidateId: Joi.string().custom(objectId),
      jobId: Joi.string().custom(objectId),
      jobRequestId: Joi.string().custom(objectId),
      requestStatus: Joi.string().valid('pending', 'approved', 'canceled', 'rejected'),
      }),
  };

  const deleteJobRequest = {
    body: Joi.object()
    .keys({
      candidateId: Joi.string().custom(objectId).required(),
      jobId: Joi.string().custom(objectId).required(),
      jobRequestId: Joi.string().custom(objectId).required()
    })
  };


  module.exports={createJobRequest,updateJobRequest,deleteJobRequest};

