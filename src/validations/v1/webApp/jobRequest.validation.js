const Joi = require('joi');
const { password, objectId } = require('./custom.validation');


const createJobRequest = {
    body: Joi.object().keys({
      clientId: Joi.string().required().custom(objectId),
      candidateId: Joi.string().required().custom(objectId),
      jobDetailId: Joi.string().required().custom(objectId),
      requestStatus: Joi.string().required().valid('pending', 'approved', 'canceled', 'rejected'),
    })
  };


  const updateJobRequest = {
    params: Joi.object().keys({
      jobRequestId: Joi.required().custom(objectId),
    }),
    body: Joi.object()
      .keys({
      clientId: Joi.string().custom(objectId),
      candidateId: Joi.string().custom(objectId),
      jobDetailId: Joi.string().custom(objectId),
      requestStatus: Joi.string().valid('pending', 'approved', 'canceled', 'rejected'),
      }),
  };

  const deleteJobRequest = {
    params: Joi.object().keys({
        jobRequestId1: Joi.string().custom(objectId),
    }),
    body: Joi.object()
    .keys({
      clientId: Joi.string().custom(objectId).required(),
    })
  };


  module.exports={createJobRequest,updateJobRequest,deleteJobRequest};

