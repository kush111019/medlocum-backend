const Joi = require('joi');
const { password, objectId } = require('./custom.validation');


const createFavouriteCandidate = {
    params: Joi.object().keys({
      clientId: Joi.custom(objectId).required(),
    }),
    body: Joi.object()
    .keys({
      candidateId: Joi.custom(objectId).required(),
      createdAt: Joi.date().required(),
      updatedAt: Joi.date().required(),

    }),

};

const deleteFavouriteCandidate={
  params: Joi.object().keys({
    clientId: Joi.required().custom(objectId),
  }),
  body: Joi.object()
  .keys({
    candidateId: Joi.required().custom(objectId),
    favouriteCandidateId: Joi.required().custom(objectId)

  }),
    
};

module.exports={createFavouriteCandidate,deleteFavouriteCandidate};

