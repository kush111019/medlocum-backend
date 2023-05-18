const httpStatus = require('http-status');
const User=require('../../../models/user.model')
const userDetail=require('../../../models/userDetail.model');
const jobDetails=require('../../../models/jobDetail.model');
const jobRequest=require('../../../models/jobRequest.model');
const favouriteCandidate=require('../../../models/favouriteCandidate.model');
const favouriteJob=require('../../../models/favouriteJob.model');
const ApiError = require('../../../utils/ApiError');
const userService = require('./user.service');
const tokenService = require('./token.service');
/**
 * jobCategoryExists
 * @param {ObjectId} categoryId
 * @returns {Promise} jobCategory
 * 
 */



/**
 * saveJobDetails
 * @param {} jobObject
 * @returns {Promise} jobCategorySaved
 * 
 */



const saveJobDetails= async(user,body)=>{


if(user.role!="client")  throw new ApiError(httpStatus.UNAUTHORIZED, 'Not a client')
 
const clientId=user._id;

const clientIsRegistered=await User.findById({_id:clientId})

if(!clientIsRegistered) throw new ApiError(httpStatus.NOT_FOUND, 'client is not registered');



let startDate1=new Date(body.startDate);

let endDate1=new Date(body.endDate);
 
let itemsPerDay=body.itemsPerDay;

 if(["100-300"].indexOf(itemsPerDay)==-1) throw new ApiError(httpStatus.BAD_REQUEST, 'Incorrect itemsPerDay'); 

 body.startDate=startDate1;
 body.endDate=endDate1;
 body.clientId=clientId;

 const jobDetailsSaved=await jobDetails.create(body);

 if(!jobDetailsSaved) throw new ApiError(httpStatus.INTERNAL_SERVER, 'Incorrect objectId');

 return jobDetailsSaved;


}

const getJobDetailsById= async(objectId1)=> {
    
    let jobDetailsExists= await jobDetails.findById({_id:objectId1});
    if(!jobDetailsExists) throw new ApiError(httpStatus.NOT_FOUND, 'Not found');

    return jobDetailsExists;

}

const getJobDetailsForBoth=async(user)=>{
  
  if(user.role=="client") 
  {
  let userId=user._id;

  let jobDetails1=await jobDetails.find({clientId:userId});
  
  if(!jobDetails1) throw new ApiError(httpStatus.NOT_FOUND, 'Not found');

    return jobDetails1;
  }

  if(user.role=="candidate"){
    let userId=user._id;
    let jobDetails1=await favouriteJob.find({candidateId:userId});
    let jobDetailsClientId=[];
    jobDetails1.forEach(function(candidateAndClient){
     
      jobDetailsClientId.push(candidateAndClient.clientId)
   })
   
   let jobDetail1=await jobDetails.find({clientId:{$in:jobDetailsClientId}});

   return jobDetail1;
  }

}


const updateJobDetails=async(user,body,jobId) => {

if(user.role!="client") throw new ApiError(httpStatus.NOT_FOUND, 'user is not a client');

let clientId=user._id;

let clientIsRegistered=await User.findById({_id:clientId});

if(!clientIsRegistered) throw new ApiError(httpStatus.NOT_FOUND, 'client is not registered');

const jobDetailExits=await getJobDetailsById(jobId);
if (!jobDetailExits) {
    throw new ApiError(httpStatus.NOT_FOUND, 'jobDetails not found with this jobDetailId');
  } 

let clientIdFromJobDetail=jobDetailExits.clientId.toString();

clientId=clientId.toString();

if(clientIdFromJobDetail!==clientId) throw new ApiError(httpStatus.NOT_FOUND, 'clientId does not match');
 
  Object.assign(jobDetailExits,body);
  await jobDetailExits.save();
  return jobDetailExits;

}


const deleteJobDetails=async(user,jobId)=>{
  
if(user.role!="client") throw new ApiError(httpStatus.UNAUTHORIZED, 'user is not a client');

let clientId=user._id;

let clientIsRegistered=await User.findById({_id:clientId});

if(!clientIsRegistered) throw new ApiError(httpStatus.NOT_FOUND, 'user is not a client')

let jobDetailExists=await jobDetails.findById({_id:jobId});

if(!jobDetailExists) throw new ApiError(httpStatus.NOT_FOUND, 'jobDetails not found with this jobDetailId');


const clientIdFromJobDetail=jobDetailExists.clientId.toString();

clientId=clientId.toString();

if(clientIdFromJobDetail!=clientId) throw new ApiError(httpStatus.NOT_FOUND, 'clientID does not match');

  await jobDetailExists.remove();
  return jobDetailExists;

}


const createJobRequest=async(body,user)=>{

  if(user.role!="candidate") throw new ApiError(httpStatus.UNAUTHORIZED,'User is not a candidate');

  let candidateId=user._id;

  let{clientId,jobId}=body;

  body.candidateId=candidateId;

  let clientIsRegistered=await User.findById({_id:clientId});

  if(!clientIsRegistered) throw new ApiError(httpStatus.NOT_FOUND,'Client is not registered');

  let jobExists=await jobDetails.findById({_id:jobId});
  console.log(jobExists);

  if(!jobExists) throw new ApiError(httpStatus.NOT_FOUND,'Job does not exist');

  let clientIdFromJobDetails=jobExists.clientId;

  if(clientIdFromJobDetails!=clientId) throw new ApiError(httpStatus.NOT_FOUND,'this job is not registered with this clientId');

  let requestStatus="pending";

  body.requestStatus=requestStatus;

  const jobRequest1=await jobRequest.create(body);


  return jobRequest1;

}


const updateJobRequest=async(user,body)=>{
   
  if(user.role!="client") throw new ApiError(httpStatus.UNAUTHORIZED, 'User is not a client');

  let clientId=user._id;

  let{candidateId,requestStatus,jobId,jobRequestId}=body;

  let clientExistsInRecords=await User.findById({_id:clientId});

  if(!clientExistsInRecords) throw new ApiError(httpStatus.NOT_FOUND,'client is not registered');

  let candidateExistsInRecords=await User.findById({_id:candidateId});

  if(!candidateExistsInRecords) throw new ApiError(httpStatus.NOT_FOUND,'candidate is not registered');

  let jobIdExistsInRecords=await jobDetails.findById({_id:jobId});
  if(!jobIdExistsInRecords) throw new ApiError(httpStatus.NOT_FOUND,'cannot update with this jobId');

  let clientIdFromJobDetails;
  clientIdFromJobDetails=jobIdExistsInRecords.clientId.toString();
  clientId=clientId.toString();
  if(clientIdFromJobDetails!==clientId) throw new ApiError(httpStatus.NOT_FOUND,'no job details are found with this clientId');

  
  let jobRequestIdExists=await jobRequest.findById({_id:jobRequestId});

  if(!jobRequestIdExists) throw new ApiError(httpStatus.NOT_FOUND,'no record is found with this jobRequestId');

  let clientIdFromJobRequest=jobRequestIdExists.clientId.toString();
  let candidateIdFromJobRequest=jobRequestIdExists.candidateId.toString();
  candidateId=candidateId.toString();
  if(clientIdFromJobRequest!==clientId) throw new ApiError(httpStatus.NOT_FOUND,'record cannot be updated with this clientId');

  if(candidateIdFromJobRequest!==candidateId) throw new ApiError(httpStatus.NOT_FOUND,'record cannot be updated with this candidateId');

  Object.assign(jobRequestIdExists,body);
  await jobRequestIdExists.save();
  return jobRequestIdExists;

}

const deleteJobRequest=async(user,body)=>{

if(user.role!="client") throw new ApiError(httpStatus.UNAUTHORIZED,'user is not a client');

let clientId=user._id;

let{jobRequestId,candidateId,jobId}=body;

let clientExists=await User.findById({_id:clientId});

if(!clientExists) throw new ApiError(httpStatus.NOT_FOUND,'Client is not registered');

let candidateExistsInRecords=await User.findById({_id:candidateId});

if(!candidateExistsInRecords) throw new ApiError(httpStatus.NOT_FOUND,'candidate is not registered');

let jobDetailsExists=await jobDetails.findById({_id:jobId});

if(!jobDetailsExists) throw new ApiError(httpStatus.NOT_FOUND,'job details does not exists with this jobRequestId');

let clientIdExistsInJobDetails=jobDetailsExists.clientId.toString();
clientId=clientId.toString();

if(clientIdExistsInJobDetails!=clientId) throw new ApiError(httpStatus.NOT_FOUND, 'no job details exists with this jobRequestId');

const jobRequestRecordExists=await jobRequest.findById({_id:jobRequestId});

if(!jobRequestRecordExists) throw new ApiError(httpStatus.NOT_FOUND, 'job request not found');

let clientIdInRecord=jobRequestRecordExists.clientId.toString();
let jobDetailIdInRecord=jobRequestRecordExists.jobId.toString();

if(clientIdInRecord!=clientId) throw new ApiError(httpStatus.NOT_FOUND,'no record exists with this clientId');

if(jobDetailIdInRecord!=jobId) throw new ApiError(httpStatus.NOT_FOUND,'no record exists with this jobDetailId');


await jobRequestRecordExists.remove();
return jobRequestRecordExists;

}


const filteredJobDetails=async(experience1,jobType1,user)=>{


 let jobTypeInDb=["Full-Time","Part-Time","Locum","Out Of Hours,","Daytime GP"];

 let experienceInDb=["01-03 Years","03-05 Years","05-07 Years","07-10 Years","10> Years"];
 let experience=null;
 let jobType=null;
 if(experience1!==null){
 experience=experience1;
 }

if(jobType1!==null){
  jobType=jobType1;
}
 
if(experience!==null && jobType!==null){
  let jobArr=[];
  let expArr=[];
  let count1=0;
  let count2=0;
  let data=[];
 if(experience.length>0 && jobType.length>0)
 {
 for(let i=0;i<jobTypeInDb.length;i++)
 {
  for(let j=0;j<jobType.length;j++)
  {
   if(jobTypeInDb[i]==jobType[j])
   {
    jobArr[count1]=jobType[j];
    count1++;
    break;
   }
  }
 }
 for(let i=0;i<experienceInDb.length;i++)
 {
  for(let j=0;j<experience.length;j++)
  {
   if(experienceInDb[i]==experience[j])
   {
    expArr[count2]=experience[j];
    count2++;
    break;
   }
  }
 }
 let i,j;
 for(i=0;i<jobArr.length;i++)
 {
  let type1=jobArr[i];
  data[i]=await jobDetails.find({type:type1})
 }
 j=i;
 for(k=0;k<expArr.length;k++)
 {
  let exp=expArr[k]
  data[j]=await jobDetails.find({experience:exp})
  j++;
 }
//  data=jobDetails.find({$or:[{experience:{$in:expArr}}],$or:[{type:{$in:jobType}}]});
 return data; 
}
}
 if(experience!=null && jobType===null){
  let count2=0;
  let expArr=[];
  let data=[];
if(experience.length>0)
{
  
  for(let i=0;i<experienceInDb.length;i++)
  {
  for(let j=0;j<experience.length;j++)
   {
    if(experienceInDb[i]==experience[j])
    {
     expArr[count2]=experience[j];
     count2++;
     break;
    }
   }
  }

  console.log(expArr);
  for(let i=0;i<expArr.length;i++)
  {
    let exp=expArr[i];
    data[i]=await jobDetails.find({experience:exp});
  } 
  //data=await jobDetails.find({experience:{$in:expArr}});
}
return data;
} 
 if(jobType!==null && experience===null){
  let count1=0;
  let jobArr=[];
  let data=[];
  if(jobType.length>0)
{
  for(let i=0;i<jobTypeInDb.length;i++)
  {
   for(let j=0;j<jobType.length;j++)
   {
    if(jobTypeInDb[i]==jobType[j])
    {
     jobArr[count1]=jobType[j];
     count1++;
     break;
    }
   }
  }
  //  for(let i=0;i<jobArr.length;i++)
  //  {
  //   let job=jobArr[i];
  //   data[i]=await jobDetails.find({type:job});
  //  }
  //  return data;
  data=jobDetails.find({type:{$in:jobArr}})
}
 return data;
}
else
{
if(user=="candidate")
{
let jobDetails1=await jobDetails.find({}).limit(50);
return jobDetails1;
}
}
}
const favouriteJobById=async(objectId)=>{
 
let favouriteJobById=await favouriteJob.findById({_id:objectId});

if(!favouriteJobById) throw new ApiError(httpStatus.NOT_FOUND, 'Not found');

  return favouriteJobById;
}

const favouriteCandidateById=async(objectId)=>{

let favouriteCandidateById=await favouriteCandidate.findById({_id:objectId})

if(!favouriteCandidateById) throw new ApiError(httpStatus.NOT_FOUND, 'Not found');

return favouriteCandidateById;
}




const createFavouriteJob=async(clientId,user,jobId,createdAt,updatedAt)=>{
 
if(user.role!="candidate") throw new ApiError(httpStatus.UNAUTHORIZED, 'user is not candidate');

let candidateId=user._id;


let candidateIdExists=await User.findById({_id:candidateId});

if(!candidateIdExists) throw new ApiError(httpStatus.NOT_FOUND, 'candidate not found with this candidateId');

let clientExists=await User.findById({_id:clientId});

if(!clientExists) throw new ApiError(httpStatus.NOT_FOUND, 'client is not registered')

let jobIdExists=await getJobDetailsById(jobId);

if(!jobIdExists) throw new ApiError(httpStatus.NOT_FOUND, 'job details not found');

let clientIdFromJobDetails=jobIdExists.clientId;

if(clientIdFromJobDetails!=clientId) throw new ApiError(httpStatus.NOT_FOUND, 'clientId is not matching');



let date1=new Date(createdAt);
let date2=new Date(updatedAt);
let obj=new Object();
obj.jobId=jobId;
obj.candidateId=candidateId;
obj.createdAt=date1;
obj.updatedAt=date2;

let data=await favouriteJob.create(obj);

return data;

}



const deleteFavouriteJob=async(user,jobId,favouriteJobId,clientId)=>{

 if(user.role!="candidate") throw new ApiError(httpStatus.UNAUTHORIZED, 'user is not a candidate');

 let candidateId=user._id;


 let candidateIdExists=await User.findById({_id:candidateId});
 
 if(!candidateIdExists) throw new ApiError(httpStatus.NOT_FOUND, 'candidate is not registered');

 let clientExists=await User.findById({_id:clientId});

 if(!clientExists) throw new ApiError(httpStatus.NOT_FOUND, 'client not is registered');

 let jobIdExistsInJobDetails=await getJobDetailsById(jobId);

 if(!jobIdExistsInJobDetails) throw new ApiError(httpStatus.NOT_FOUND, 'job details not found');
 
 let clientIdFromJobDetails=jobIdExistsInJobDetails.clientId;

 if(clientIdFromJobDetails!=clientId) throw new ApiError(httpStatus.NOT_FOUND, 'client Id is not matching');

 let favouriteJobExists=await favouriteJob.findById({_id:favouriteJobId});

 if(!favouriteJobExists) throw new ApiError(httpStatus.NOT_FOUND, 'favouriteJob not exist');

let jobIdFromJobExists=favouriteJobExists.jobId;

jobIdFromJobExists=jobIdFromJobExists.toString();


if(jobIdFromJobExists!==jobId) throw new ApiError(httpStatus.NOT_FOUND, 'record cannot be deleted with this jobId');

console.log(favouriteJobExists);
let candidateIdFromJobExists=favouriteJobExists.candidateId;

candidateIdFromJobExists = candidateIdFromJobExists.toString();

if(candidateIdFromJobExists!=candidateId) throw new ApiError(httpStatus.NOT_FOUND,'Record cannot be deleted with this candidateId');

await favouriteJobExists.remove();
return favouriteJobExists;

}


const createFavouriteCandidate=async(user,candidateId,createdAt,updatedAt)=>

{
if(user.role!="client") throw new ApiError(httpStatus.UNAUTHORIZED, 'user is not a client');

let clientId=user._id;

let clientIdExists=await User.findOne({_id:clientId});

if(!clientIdExists) throw new ApiError(httpStatus.NOT_FOUND, 'client is not registered');

let candidateIdExists=await User.findById({_id:candidateId});


if(!candidateIdExists) throw new ApiError(httpStatus.NOT_FOUND, 'candidate is not registered');

let date1=new Date(createdAt);
let date2=new Date(updatedAt);

let obj=new Object();
obj.clientId=clientId;
obj.candidateId=candidateId;
obj.createdAt=date1;
obj.updatedAt=date2;

let data=await favouriteCandidate.create(obj);

return data;

}

const deleteFavouriteCandidate=async(user,candidateId,favouriteCandidateId)=>{

  if(user.role!="client") throw new ApiError(httpStatus.UNAUTHORIZED, 'user is not a client');

  let clientId=user._id;

  let clientIsRegistered=await User.findById({_id:clientId});
  
  if(!clientIsRegistered) throw new ApiError(httpStatus.NOT_FOUND, 'client is not registered');

  let candidateIsRegistered=await User.findById({_id:candidateId});
  
  if(!candidateIsRegistered) throw new ApiError(httpStatus.NOT_FOUND, 'candidate is not registered');

  let favouriteCandidateIdExists=await favouriteCandidateById(favouriteCandidateId)
  
  if(!favouriteCandidateIdExists) throw new ApiError(httpStatus.NOT_FOUND, 'no favourite candidate record is found with this candidateId')

  let favouriteCandidateIdInRecord=favouriteCandidateIdExists.candidateId.toString();
  let favouriteClientIdInRecord=favouriteCandidateIdExists.clientId.toString();
  

  if(favouriteCandidateIdInRecord!=candidateId) throw new ApiError(httpStatus.NOT_FOUND,'candidate Id is not matching');
  
  if(favouriteClientIdInRecord!=clientId) throw new ApiError(httpStatus.NOT_FOUND,'client Id is not matching');


  await favouriteCandidateIdExists.remove();
  return favouriteCandidateIdExists;



}


const compressImage = async function(user,imageFile){

  fs.access("./uploads", (error) => {
    if (error) {
      fs.mkdirSync("./uploads");
    }
  });
  const { buffer, originalname } = imageFile;
  const timestamp = new Date().toISOString();
  const ref = `${timestamp}-${originalname}.webp`;
  await sharp(buffer)
    .webp({ quality: 20 })
    .toFile("./uploads/" + ref);
  const link = `http://localhost:3000/${ref}`;
  return res.json({ link });

}


module.exports={saveJobDetails,getJobDetailsById,updateJobDetails,deleteJobDetails,createJobRequest,updateJobRequest,deleteJobRequest,filteredJobDetails,deleteFavouriteJob,deleteFavouriteCandidate,createFavouriteCandidate,createFavouriteJob,getJobDetailsForBoth,compressImage};