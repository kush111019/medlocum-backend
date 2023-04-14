const nodemailer = require('nodemailer');
const config = require('../../../config/config');
const logger = require('../../../config/logger');
const ApiError = require('../../../utils/ApiError');
const contactUs=require('../../../models/contactUs.model')
const userDetail = require('../../../models/userDetail.model');
const user=require('../../../models/user.model');

const transport = nodemailer.createTransport(config.email.smtp);
/* istanbul ignore next */
if (config.env !== 'test') { 
  transport
    .verify()
    .then(() => logger.info('Connected to email server'))
    .catch(() => logger.warn('Unable to connect to email server. Make sure you have configured the SMTP options in .env'));
}

/**
 * Send an email
 * @param {string} to
 * @param {string} subject
 * @param {string} text
 * @returns {Promise}
 */
const sendEmail = async (to, subject, text) => {
  const msg = { from: config.email.from, to, subject, text };
  await transport.sendMail(msg);
};

/**
 * Send reset password email
 * @param {string} to
 * @param {string} token
 * @returns {Promise}
 */
const sendResetPasswordEmail = async (to, token) => {
  const subject = 'Reset password';
  // replace this url with the link to the reset password page of your front-end app
  const resetPasswordUrl = `http://link-to-app/reset-password?token=${token}`;
  const text = `Dear user,
To reset your password, click on this link: ${resetPasswordUrl}
If you did not request any password resets, then ignore this email.`;
  await sendEmail(to, subject, text);
};

/**
 * Send verification email
 * @param {string} to
 * @param {string} token
 * @returns {Promise}
 */
const sendVerificationEmail = async (to, token) => {
  const subject = 'Email Verification';
  // replace this url with the link to the email verification page of your front-end app
  const verificationEmailUrl = `http://link-to-app/verify-email?token=${token}`;
  const text = `Dear user,
To verify your email, click on this link: ${verificationEmailUrl}
If you did not create an account, then ignore this email.`;
  await sendEmail(to, subject, text);
};

const contactUsForInformation = async(body,user) => {

if(user.role=="candidate")  
{
if(user.emailVerified===false) throw new ApiError(httpStatus.UNAUTHORIZED, 'email of the candidate is not verified');


let candidateId=user._id;
let email=user.email;

let contactNumber=user.mobileNumber;



let candidateDetails=await userDetail.findOne({userId:candidateId});


if(!candidateDetails) throw new ApiError(httpStatus.NOT_FOUND,'candidate details not found');


let name=candidateDetails.firstName;

body.name=name;
body.contactNumber=contactNumber;
body.email=email;



let newRecord=await contactUs.create(body);

if(!newRecord) throw new ApiError(httpStatus.NOT_FOUND,'record is not inserted');

let to="kmgarora61@gmail.com";
//let to="krishna.gopal@appdesign.ie";
let subject=body.subject;
let text=body.message;


let transporter = nodemailer.createTransport({
  host:config.email.smtp.host,
  port:config.email.smtp.port,
  auth:config.email.smtp.auth

});


let mailOptions = {
  from: email,
  to: to,
  subject: subject,
  text: text
};


transporter.sendMail(mailOptions, function(error, info){
  if (error) {
    console.log(error);
  } else {
    console.log('Email sent: ' + info.response);
  }
});


return newRecord;
}

if(user.role==="client")
{

if(user.emailVerified===false) throw new ApiError(httpStatus.UNAUTHORIZED, 'email of the client is not verified');


let clientId=user._id;
let email=user.email;

let contactNumber=user.mobileNumber;



let clientDetails=await userDetail.findOne({userId:clientId});


if(!clientDetails) throw new ApiError(httpStatus.NOT_FOUND,'candidate details not found');


let name=clientDetails.firstName;

body.name=name;
body.contactNumber=contactNumber;
body.email=email;



let newRecord=await contactUs.create(body);

if(!newRecord) throw new ApiError(httpStatus.NOT_FOUND,'record is not inserted');

let to="kmgarora61@gmail.com";
//let to="krishna.gopal@appdesign.ie";
let subject=body.subject;
let text=body.message;


let transporter = nodemailer.createTransport({
  host:config.email.smtp.host,
  port:config.email.smtp.port,
  auth:config.email.smtp.auth
});

 let from=config.email.from;

let mailOptions = {
  from: from,
  to: to,
  subject: subject,
  text: text
};


transporter.sendMail(mailOptions, function(error, info){
  if (error) {
    console.log(error);
  } else {
    console.log('Email sent: ' + info.response);
  }
});


return newRecord;
}

}




module.exports = {
  transport,
  sendEmail,
  sendResetPasswordEmail,
  sendVerificationEmail,
  contactUsForInformation
};
