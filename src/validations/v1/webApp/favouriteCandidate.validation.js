const Joi = require('joi');
const { password, objectId } = require('./custom.validation');


const createFavouriteCandidate = {
    body: Joi.object()
    .keys({
      candidateId: Joi.custom(objectId).required(),
      createdAt: Joi.date().required(),
      updatedAt: Joi.date().required(),

    }),

};

const deleteFavouriteCandidate={
  body: Joi.object()
  .keys({
    candidateId: Joi.required().custom(objectId),
    favouriteCandidateId: Joi.required().custom(objectId)

  }),
    
};

module.exports={createFavouriteCandidate,deleteFavouriteCandidate};

