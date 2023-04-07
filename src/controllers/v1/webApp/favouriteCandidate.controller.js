const httpStatus = require('http-status');
const catchAsync = require('../../../utils/catchAsync');
const jobService = require('../../../services/v1/webApp/job.service');
const utility = require('../../../utils/helpers');

const createFavouriteCandidate=catchAsync(async(req,res)=>{
    
    let user=req.user;
    let candidateId=req.body.candidateId;
    let createdAt=req.body.createdAt;
    let updatedAt=req.body.updatedAt;

    let arr=[];
    arr.push(user);
    arr.push(candidateId);
    arr.push(createdAt);
    arr.push(updatedAt);
    
    let data1=await jobService.createFavouriteCandidate(...arr);
    
    res.sendJSONResponse({
        code: httpStatus.OK,
        status: true,
        message: utility.getWebAppMessages('jobMessage.favouriteCandidateAddedSuccess'),
        data:{result:data1}
      });
  
  
  })


  const deleteFavouriteCandidate=catchAsync(async(req,res)=>{
   
    let user=req.user;
    let candidateId=req.body.candidateId;
    let favouriteCandidateId=req.body.favouriteCandidateId;

    let arr=[];
    arr.push(user);
    arr.push(candidateId);
    arr.push(favouriteCandidateId);

    let data1=await jobService.deleteFavouriteCandidate(...arr);

   
    res.sendJSONResponse({
        code: httpStatus.OK,
        status: true,
        message: utility.getWebAppMessages('jobMessage.favouriteCandidateDeletedSuccess'),
        data:{result:data1}
      });

 })
  
 module.exports={createFavouriteCandidate,deleteFavouriteCandidate};