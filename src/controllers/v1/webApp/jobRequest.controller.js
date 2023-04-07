const httpStatus = require('http-status');
const catchAsync = require('../../../utils/catchAsync');
const jobService = require('../../../services/v1/webApp/job.service');
const userService=require('../../../services/v1/webApp/user.service');
const utility = require('../../../utils/helpers');
const User=require('../../../models/user.model');
const ApiError = require('../../../utils/ApiError');

const createJobRequest = catchAsync(async (req, res) => {

let body=req.body;
let user=req.user;
const createdJobRequest=await jobService.createJobRequest(body,user);

//res.status(201).send({status:true,message:createdJobRequest});

res.sendJSONResponse({
    code: httpStatus.OK,
    status: true,
    message: utility.getWebAppMessages('jobMessage.jobRequestCreatedSuccess'),
    data:{result:createdJobRequest}
  });

//res.status(httpStatus.CREATED).send({ createdJobRequest});

})

const updateJobRequest=catchAsync(async (req,res)=>{

let user=req.user;

if(user.role!="client") throw new ApiError(httpStatus.NOT_FOUND,'user is not a client');


const body=req.body;


const jobRequest=await jobService.updateJobRequest(user,body);

res.sendJSONResponse({
    code: httpStatus.OK,
    status: true,
    message: utility.getWebAppMessages('jobMessage.jobRequestUpdatedSuccess'),
    data:jobRequest
  });


//res.status(httpStatus.CREATED).send({jobRequest});


})

const deleteJobRequest=catchAsync(async(req,res)=>{
    
let user=req.user;

if(user.role!="client") throw new ApiError(httpStatus.NOT_FOUND, 'User is not a candidate');

let body=req.body;

const jobRequest=await jobService.deleteJobRequest(user,body);


res.sendJSONResponse({
    code: httpStatus.OK,
    status: true,
    message: utility.getWebAppMessages('jobMessage.jobRequestDeletedSuccess'),
    data:{result:jobRequest}
  });

//res.send({jobRequest});


})





module.exports={createJobRequest,updateJobRequest,deleteJobRequest};
