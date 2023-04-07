const httpStatus = require('http-status');
const catchAsync = require('../../../utils/catchAsync');
const jobService = require('../../../services/v1/webApp/job.service');
const utility = require('../../../utils/helpers');

const createFavouriteJob = catchAsync(async (req, res) => {

let user=req.user;
let jobId=req.body.jobId;
let clientId=req.body.clientId;
let createdAt=req.body.createdAt;
let updatedAt=req.body.updatedAt;

let arr=[];
arr.push(clientId);
arr.push(user);
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

let user=req.user;
let jobId=req.body.jobId;
let favouriteJobId=req.body.favouriteJobId;
let clientId=req.body.clientId;
let arr=[];
arr.push(user);
arr.push(jobId);
arr.push(favouriteJobId);
arr.push(clientId);
let data1=await jobService.deleteFavouriteJob(...arr);



res.sendJSONResponse({
  code: httpStatus.OK,
  status: true,
  message: utility.getWebAppMessages('jobMessage.favouriteJobDeletedSuccess'),
  data:data1
});

})

module.exports={createFavouriteJob,deleteFavouriteJob};

