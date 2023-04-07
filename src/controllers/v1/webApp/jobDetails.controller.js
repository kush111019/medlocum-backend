const httpStatus = require('http-status');
const catchAsync = require('../../../utils/catchAsync');
const jobService = require('../../../services/v1/webApp/job.service');
const userService= require('../../../services/v1/webApp/user.service');
const utility = require('../../../utils/helpers');


const createJobDetails = catchAsync(async (req, res) => {
     

    const {status,title,subject,description,category,type,cmUsed,location,startDate,endDate,startTime,endTime,salaryType,salaryRange,eirCode,createdAt,updatedAt,paymentMethod,nursingHome,bilisterPacks,methadone,itemsPerDay}=req.body;


    const body=req.body;
    let user=req.user;


    const jobDetailsSaved=await jobService.saveJobDetails(user,body);
    console.log(jobDetailsSaved);
    
    res.sendJSONResponse({
        code: httpStatus.OK,
        status: true,
        message: utility.getWebAppMessages('jobMessage.jobCreatedSuccess'),
        data:{result:jobDetailsSaved}
      });

    //res.status(httpStatus.CREATED).send({ jobDetailsSaved });



});

const updateJobDetails= catchAsync(async(req,res) => {
 
    let body=req.body;
    const {status,title,subject,description,category,type,cmUsed,location,startDate,endDate,startTime,endTime,salaryType,eirCode,travelDistance,createdAt,updatedAt,paymentMethod,nursingHome,bilisterPacks,methadone,itemsPerDay}=body;
    
    let user=req.user;

    const jobId=req.params.jobId;
  




    const updatedJobDetails=await jobService.updateJobDetails(user,body,jobId);
       
    res.sendJSONResponse({
        code: httpStatus.OK,
        status: true,
        message: utility.getWebAppMessages('jobMessage.jobUpdateSuccess'),
        result:updatedJobDetails
      });


    //res.status(httpStatus.CREATED).send({ updatedJobDetails });

})


const deleteJobDetails= catchAsync(async(req,res)=>{
  
let user=req.user;

let jobId=req.params.jobId;

const deletedJobDetails=await jobService.deleteJobDetails(user,jobId);


res.sendJSONResponse({
    code: httpStatus.OK,
    status: true,
    message: utility.getWebAppMessages('jobMessage.jobDeletedSuccess'),
    result:deletedJobDetails
  });

//res.send(deletedJobDetails);

})


const filterJobDetails=catchAsync(async(req,res)=>{

let user=req.user;
let type=req.query.type;
let experience=req.query.experience;
let data1;

if(experience){
if(experience!==undefined || experience!==null){
experience=experience.toString();
experience=experience.split(",");
}
}

if(type){
if(type!==undefined || experience!==null){
type=type.toString();
type=type.split(",")
}
}

if(experience && type){
if(experience.length>0 && type.length>0)
{
  data1=await jobService.filteredJobDetails(experience,type,null);
}
}
else if(experience){
if(experience.length>0)
{
 data1=await jobService.filteredJobDetails(experience,null,null);
}
}
else if(type){
 if(type.length>0)
{
 data1=await jobService.filteredJobDetails(null,type,null);
}
}
else 
{
  console.log(user);
  data1=await jobService.filteredJobDetails(null,null,user);
}

res.sendJSONResponse({
  code: httpStatus.OK,
  status: true,
  message: utility.getWebAppMessages('jobMessage.jobFilterSuccess'),
  data:data1
});
})


const saveJobForCandidate=catchAsync(async(req,res)=>{

const body=req.body;

let data1=await jobService.saveJobForCandidate(body);

res.sendJSONResponse({
  code: httpStatus.OK,
  status: true,
  message: utility.getWebAppMessages('jobMessage.jobFilterSuccess'),
  data:data1
});

})


const getJobListForBoth=catchAsync(async(req,res) =>{

let user=req.user;
let data1=await jobService.getJobDetailsForBoth(user);

res.sendJSONResponse({
  code: httpStatus.OK,
  status: true,
  message: utility.getWebAppMessages('jobMessage.jobGetSuccess'),
  data:data1
});



})

  
module.exports={createJobDetails,updateJobDetails,deleteJobDetails,filterJobDetails,saveJobForCandidate,getJobListForBoth};