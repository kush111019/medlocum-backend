const httpStatus = require('http-status');
const catchAsync = require('../../../utils/catchAsync');
const jobService = require('../../../services/v1/webApp/job.service');
const utility = require('../../../utils/helpers');

const createFavouriteJob = catchAsync(async (req, res) => {

let candidateId=req.params.candidateId;
let jobId=req.body.jobId;
let createdAt=req.body.createdAt;
let updatedAt=req.body.updatedAt;

let arr=[];
arr.push(candidateId);
arr.push(jobId);
arr.push(createdAt);
arr.push(updatedAt);


let data1=await jobService.createFavouriteJob(...arr);

res.sendJSONResponse({
    code: httpStatus.OK,
    status: true,
    message: utility.getWebAppMessages('jobMessage.favouriteJobAddedSuccess'),
    data:data1
  });

})


const deleteFavouriteJob=catchAsync(async(req,res)=>{

let candidateId=req.params.candidateId;
let jobId=req.body.jobId;
let favouriteJobId=req.body.favouriteJobId;
let arr=[];
arr.push(candidateId);
arr.push(jobId);
arr.push(favouriteJobId);
let data1=await jobService.deleteFavouriteJob(...arr);



res.sendJSONResponse({
  code: httpStatus.OK,
  status: true,
  message: utility.getWebAppMessages('jobMessage.favouriteJobDeletedSuccess'),
  data:data1
});

})

module.exports={createFavouriteJob,deleteFavouriteJob};

