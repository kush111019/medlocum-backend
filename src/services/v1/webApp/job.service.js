const httpStatus = require('http-status');
const User=require('../../../models/user.model')
const userDetail=require('../../../models/userDetail.model');
const jobDetails=require('../../../models/jobDetail.model');
const jobRequest=require('../../../models/jobRequest.model');
const favouriteCandidate=require('../../../models/favouriteCandidate.model');
const favouriteJob=require('../../../models/favouriteJob.model');
const ApiError = require('../../../utils/ApiError');
const userService = require('./user.service');
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



const saveJobDetails= async(jobObject,userId,user)=>{
 
const user1=await User.findById({_id:userId})

if(!user1) throw new ApiError(httpStatus.NOT_FOUND, 'user not found');

if(user.role!="client")  throw new ApiError(httpStatus.UNAUTHORIZED, 'Not a client')

let startDate1=new Date(jobObject.startDate);

let endDate1=new Date(jobObject.endDate);
 
let itemsPerDay=jobObject.itemsPerDay;

 if(["100-300"].indexOf(itemsPerDay)==-1) throw new ApiError(httpStatus.UNAUTHORIZED, 'Incorrect itemsPerDay'); 

 jobObject.startDate=startDate1;
 jobObject.endDate=endDate1;
 jobObject.clientId=userId;

 const jobDetailsSaved=await jobDetails.create(jobObject);

 if(!jobDetailsSaved) throw new ApiError(httpStatus.UNAUTHORIZED, 'Incorrect objectId');

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


const updateJobDetails=async(objectId,jobObject,user) => {

const jobDetails1=await getJobDetailsById(objectId);
if (!jobDetails1) {
    throw new ApiError(httpStatus.NOT_FOUND, 'jobDetails not found');
  } 

let userId=user._id;

const userExists=await jobDetails.findOne({clientId:userId});
if(!userExists){
  throw new ApiError(httpStatus.NOT_FOUND, 'user not found');
}

if(user.role!="client") throw new ApiError(httpStatus.NOT_FOUND, 'user is not a client found');
  Object.assign(jobDetails1, jobObject);
  await jobDetails1.save();
  return jobDetails1;

}


const deleteJobDetails=async(objectId,user)=>{
  
if(user.role!="client") throw new ApiError(httpStatus.NOT_FOUND, 'user is not a client');

let userId=user._id;

const clientExists=await jobDetails.findOne({clientId:userId});

if(!clientExists){
  throw new ApiError(httpStatus.NOT_FOUND, 'client not found');
}

const jobDetailsExists = await getJobDetailsById(objectId);

if (!jobDetailsExists) {
    throw new ApiError(httpStatus.NOT_FOUND, 'jobDetails not found');
  }
  await jobDetailsExists.remove();
  return jobDetailsExists;

}


const createJobRequest=async(jobRequestObject)=>{
  
  if(['pending', 'approved', 'canceled', 'rejected'].indexOf(jobRequestObject.requestStatus) ==-1)throw new ApiError(httpStatus.UNAUTHORIZED, 'Incorrect status')

  const jobRequest1=await jobRequest.create(jobRequestObject);

  return jobRequest1;

}


const updateJobRequest=async(objectId,object)=>{
   
    const jobRequest1=await jobRequest.findById({_id:objectId});
    
    if(!jobRequest1) throw new ApiError(httpStatus.NOT_FOUND, 'Job Request not found');

    const clientExists=await jobRequest.findOne({_id:objectId,clientId:object.clientId});

    if(!clientExists) throw new ApiError(httpStatus.NOT_FOUND, 'Client not found');

    const candidateExists=await jobRequest.findOne({_id:objectId,candidateId:object.candidateId});

    if(!candidateExists) throw new ApiError(httpStatus.NOT_FOUND, 'Candidate not found');



    Object.assign(jobRequest1,object);
    await jobRequest1.save();
    return jobRequest1;

}

const deleteJobRequest=async(objectId1,objectId2)=>{

const jobRequest1=await jobRequest.findById({_id:objectId1});

if(!jobRequest1) throw new ApiError(httpStatus.NOT_FOUND, 'job request not found');

const clientIdExists=await jobRequest.findOne({clientId:objectId2});

if(!clientIdExists) throw new ApiError(httpStatus.NOT_FOUND, 'client not found');

await jobRequest1.remove();
return jobRequest1;

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

//  if(experience!==null){
//   if(experience!==undefined && experience!==null){
//  if(!Array.isArray(experience)) throw new ApiError(httpStatus.UNAUTHORIZED, 'experience is not an Array');
//   }
//  }
//  if(jobType!==null){
//   if(jobType!==undefined && jobType!==null){
//  if(!Array.isArray(jobType)) throw new ApiError(httpStatus.UNAUTHORIZED, 'jobType is not an Array')
//  }
// }



 
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




const createFavouriteJob=async(candidateId,jobId,createdAt,updatedAt)=>{
 

let jobIdExists=await getJobDetailsById(jobId);

if(!jobIdExists) throw new ApiError(httpStatus.NOT_FOUND, 'job details not found');

let candidateIdExists=await User.findById({_id:candidateId});

if(!candidateIdExists) throw new ApiError(httpStatus.NOT_FOUND, 'candidate not found');
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


const deleteFavouriteJob=async(candidateId,jobId,favouriteJobId)=>{

 
 let jobIdExists=await getJobDetailsById(jobId);

 if(!jobIdExists) throw new ApiError(httpStatus.NOT_FOUND, 'job details not found');
 
 let candidateIdExists=await User.findById({_id:candidateId});
 
 if(!candidateIdExists) throw new ApiError(httpStatus.NOT_FOUND, 'candidate not found');

let favouriteJobById1=await favouriteJobById(favouriteJobId);

if(!favouriteJobById1) throw new ApiError(httpStatus.NOT_FOUND, 'candidate not found');

await favouriteJobById1.remove();
return favouriteJobById1;

}


const createFavouriteCandidate=async(clientId,candidateId,createdAt,updatedAt)=>

{
 
let clientIdExists=await User.findOne({_id:clientId});

if(!clientIdExists) throw new ApiError(httpStatus.NOT_FOUND, 'client not found');

let candidateIdExists=await User.findOne({_id:candidateId});

if(!candidateIdExists) throw new ApiError(httpStatus.NOT_FOUND, 'candidate not found');

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

const deleteFavouriteCandidate=async(clientId,candidateId,favouriteCandidateId)=>{

  let clientIdExists=await User.findById({_id:clientId})
  //let clientIdExists=await userService.getUserById(clientId);

  if(!clientIdExists) throw new ApiError(httpStatus.NOT_FOUND, 'client not found');
  
  let candidateIdExists=await User.findById({_id:candidateId});
  //let candidateIdExists=await userService.getUserById(candidateId);

  if(!candidateIdExists) throw new ApiError(httpStatus.NOT_FOUND, 'candidate not found');
 
  let favouriteCandidateIdExists=await favouriteCandidateById(favouriteCandidateId)

  if(!favouriteCandidateIdExists) throw new ApiError(httpStatus.NOT_FOUND, 'favourite candidate not found');

  await favouriteCandidateIdExists.remove();
  return favouriteCandidateIdExists;



}


module.exports={saveJobDetails,getJobDetailsById,updateJobDetails,deleteJobDetails,createJobRequest,updateJobRequest,deleteJobRequest,filteredJobDetails,deleteFavouriteJob,deleteFavouriteCandidate,createFavouriteCandidate,createFavouriteJob,getJobDetailsForBoth};