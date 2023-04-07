const Joi = require('joi');
const { password, objectId } = require('./custom.validation');


const createJobDetails = {
    body: Joi.object().keys({
      status: Joi.string().required().valid("open","closed","canceled"),
      subject: Joi.string().required(),
      title: Joi.string().required(),
      description: Joi.string().required(),
      category: Joi.string().required(),
      type: Joi.string().required().valid("Full-Time","Part-Time","Locum","Out Of Hours","Daytime GP"),
      experience: Joi.string().required(),
      crmUsed: Joi.string().required(),
      location: Joi.string().required(),
      startDate: Joi.date().required(),
      endDate: Joi.date().required(),
      startTime: Joi.string().required(),
      endTime: Joi.string().required(),
      salaryRange: Joi.object().keys({ min: Joi.number(), max: Joi.number() }),
      salaryType: Joi.string(),
      eirCode: Joi.string().required(),
      paymentMethod: Joi.string().required(),
      nursingHome: Joi.string().required().valid("yes","no"),
      bilisterPacks: Joi.string().required().valid("yes","no"),
      methadone: Joi.string().required().valid("yes","no"),
      itemsPerDay: Joi.string().required().valid("100-300")

    })
  };


const updateJobDetails = {
    params: Joi.object().keys({
        jobId: Joi.required().custom(objectId),
    }),
    body: Joi.object()
      .keys({
      status: Joi.string().valid("open","closed","canceled"),
      subject: Joi.string(),
      title: Joi.string(),
      description: Joi.string(),
      category: Joi.string(),
      type: Joi.string().valid("Full-Time","Part-Time","Locum","Out Of Hours","Daytime GP"),
      experience: Joi.string(),
      crmUsed: Joi.string(),
      location: Joi.string(),
      startDate: Joi.date(),
      endDate: Joi.date(),
      startTime: Joi.string(),
      endTime: Joi.string(),
      salaryRange: Joi.object().keys({ min: Joi.number(), max: Joi.number() }),
      salaryType: Joi.string(),
      eirCode: Joi.string(),
      paymentMethod: Joi.string(),
      nursingHome: Joi.string().valid("yes","no"),
      bilisterPacks: Joi.string().valid("yes","no"),
      methadone: Joi.string().valid("yes","no"),
      itemsPerDay: Joi.string().valid("100-300"),

      }),
  };
  
  const deleteJobDetails = {
    params: Joi.object().keys({
        jobId: Joi.string().custom(objectId).required(),
    }),
  };
  

  const filterJobDetails = {
    query: Joi.object().keys({
     experience: Joi.string(),
     type: Joi.string(),
    }),
    };


module.exports={createJobDetails,updateJobDetails,deleteJobDetails,filterJobDetails};