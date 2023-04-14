const httpStatus = require('http-status');
const catchAsync = require('../../../utils/catchAsync');
const emailService = require('../../../services/v1/webApp/email.service');
const utility = require('../../../utils/helpers');



const contactUs=catchAsync(async(req,res)=>{

let body=req.body;

let user=req.user;

let data1=emailService.contactUsForInformation(body,user);

res.sendJSONResponse({
    code: httpStatus.OK,
    status: true,
    message: utility.getWebAppMessages('contactUs.emailSentSuccess'),
  });


})




 module.exports = {contactUs};
