const Joi = require('joi');
const { password, objectId } = require('./custom.validation');

const createFavouriteJob = {
  body: Joi.object()
  .keys({
    jobId: Joi.required().custom(objectId),
    clientId: Joi.required().custom(objectId),
    createdAt: Joi.date().required(),
    updatedAt: Joi.date().required(),
  }),

};


const deleteFavouriteJob={
  body: Joi.object()
  .keys({
    jobId: Joi.required().custom(objectId),
    favouriteJobId: Joi.required().custom(objectId),
    clientId: Joi.required().custom(objectId),

  }),
    
};




module.exports={createFavouriteJob,deleteFavouriteJob};
