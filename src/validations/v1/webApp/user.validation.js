const Joi = require('joi');
const { password, objectId } = require('./custom.validation');

const createUser = {
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().custom(password),
    name: Joi.string().required(),
    role: Joi.string().required().valid('user', 'admin'),
  }),
};

const getUsers = {
  query: Joi.object().keys({
    name: Joi.string(),
    role: Joi.string(),
    sortBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
  }),
};

const getUser = {
  params: Joi.object().keys({
    userId: Joi.string().custom(objectId),
  }),
};

const updateUser = {
  params: Joi.object().keys({
    userId: Joi.required().custom(objectId),
  }),
  body: Joi.object()
    .keys({
      email: Joi.string().email(),
      password: Joi.string().custom(password),
      name: Joi.string(),
    })
    .min(1),
};

const deleteUser = {
  params: Joi.object().keys({
    userId: Joi.string().custom(objectId),
  }),
};

const createPrefrences = {
  body: Joi.object().keys({
    jobCategory: Joi.string().allow(null),
    jobType: Joi.string().allow(null),
    speciality: Joi.string().allow(null),
    weekHours: Joi.string().allow(null),
    salaryRange: Joi.object().keys({ min: Joi.number(), max: Joi.number() }),
    salaryType: Joi.string().allow(null),
    eirCode: Joi.string().allow(null),
    isAvailForEmergency: Joi.boolean(),
    isBlocking: Joi.boolean(),
    availability: Joi.string().allow(null),
    travelDistance: Joi.string().allow(null),
  }),
};

const getSpecificJob={
  query: Joi.object().keys({
    jobId: Joi.string().custom(objectId),   

  })

};

const getSpecificCandidate={

  query: Joi.object().keys({
    candidateId: Joi.string().custom(objectId),   

  })

}

module.exports = {
  createUser,
  getUsers,
  getUser,
  updateUser,
  deleteUser,
  createPrefrences,
  getSpecificJob,
  getSpecificCandidate,
};
