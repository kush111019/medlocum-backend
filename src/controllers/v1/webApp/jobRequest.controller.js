const httpStatus = require('http-status');
const catchAsync = require('../../../utils/catchAsync');
const jobService = require('../../../services/v1/webApp/job.service');
const userService=require('../../../services/v1/webApp/user.service');
const utility = require('../../../utils/helpers');
const User=require('../../../models/user.model');

const createJobRequest = catchAsync(async (req, res) => {


const {clientId,candidateId,jobDetailId,requestStatus}=req.body;


let body=req.body;

const jobDetails=await jobService.getJobDetailsById(jobDetailId);


if(!jobDetails) return res.status(httpStatus.NO_CONTENT).send();


const client=await User.findById({_id:clientId});


if(!client) return res.status(httpStatus.NO_CONTENT).send();


const candidate=await User.findById({_id:clientId});


if(!candidate) return res.status(httpStatus.NO_CONTENT).send();


const createdJobRequest=await jobService.createJobRequest(body);

res.sendJSONResponse({
    code: httpStatus.OK,
    status: true,
    message: utility.getWebAppMessages('jobMessage.jobRequestCreatedSuccess'),
    data:createdJobRequest
  });

//res.status(httpStatus.CREATED).send({ createdJobRequest});

})

const updateJobRequest=catchAsync(async (req,res)=>{


const jobRequestId=req.params.jobRequestId;


const {clientId,candidateId,jobDetailId,requestStatus}=req.body;

const body=req.body;


const jobRequest=await jobService.updateJobRequest(jobRequestId,body);

res.sendJSONResponse({
    code: httpStatus.OK,
    status: true,
    message: utility.getWebAppMessages('jobMessage.jobRequestUpdatedSuccess'),
    data:jobRequest
  });


//res.status(httpStatus.CREATED).send({jobRequest});


})

const deleteJobRequest=catchAsync(async(req,res)=>{
    

const jobRequestId1=req.params.jobRequestId1;

const clientId=req.body.clientId;

const jobRequest=await jobService.deleteJobRequest(jobRequestId1,clientId);


res.sendJSONResponse({
    code: httpStatus.OK,
    status: true,
    message: utility.getWebAppMessages('jobMessage.jobRequestDeletedSuccess'),
    data:jobRequest
  });

//res.send({jobRequest});


})





module.exports={createJobRequest,updateJobRequest,deleteJobRequest};
