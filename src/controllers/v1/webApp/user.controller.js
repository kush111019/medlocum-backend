const httpStatus = require('http-status');
const pick = require('../../../utils/pick');
const ApiError = require('../../../utils/ApiError');
const catchAsync = require('../../../utils/catchAsync');
const { userService } = require('../../../services/v1/webApp');
const utility = require('../../../utils/helpers');


const createUser = catchAsync(async (req, res) => {
  const user = await userService.createUser(req.body);
  res.status(httpStatus.CREATED).send(user);
});

const getUsers = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['name', 'role']);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const result = await userService.queryUsers(filter, options);
  res.send(result);
});

const getUser = catchAsync(async (req, res) => {
  const user = await userService.getUserById(req.params.userId);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }
  res.send(user);
});

const updateUser = catchAsync(async (req, res) => {
  const user = await userService.updateUserById(req.params.userId, req.body);
  res.send(user);
});

const deleteUser = catchAsync(async (req, res) => {
  await userService.deleteUserById(req.params.userId);
  res.status(httpStatus.NO_CONTENT).send();
});

const candidateHomePage = catchAsync(async (req, res) => {

  let user = req.user;
  let data1 = await userService.candidateHomePage(user);
  res.status(200).send({status:true,message:data1})
  // res.sendJSONResponse({
  //   code: httpStatus.OK,
  //   status: true,
  //   message: utility.getWebAppMessages('homePage.CandidateRecommendedJobSuccess'),
  //   data: {results:data1}
  // })

})


const clientHomePage = catchAsync(async (req, res) => {

  let user = req.user;

  let data1 = await userService.clientHomePage(user);


  res.sendJSONResponse({

    code: httpStatus.OK,
    status: true,
    message: utility.getWebAppMessages('homePage.ClientRecommendedCandidateSuccess'),
    data:{results:data1}

  })


})

const matchedCandidatesForClientHomePage=catchAsync(async(req,res)=>{


 let user=req.user;
 let jobTypeRequired=req.query.jobType;
 let experienceLevelRequired=req.query.experience;
 let locationRequired=req.query.location;
 let subjectRequired=req.query.subject;
 let titleRequired=req.query.title;
 let categoryRequired=req.query.jobCategory;
 let salaryRangeRequired=req.query.salaryRange;
 let specialityRequired=req.query.speciality;
 let weekHoursRequired=req.query.weekHours;
 let availabilityRequired=req.query.availability;
 

 
  if(experienceLevelRequired!=undefined || experienceLevelRequired!=null){
  experienceLevelRequired=experienceLevelRequired.toString();
  experienceLevelRequired=experienceLevelRequired.split(",");
  }
  
  
  
  if(jobTypeRequired!=undefined || jobTypeRequired!=null){
  jobTypeRequired=jobTypeRequired.toString();
  jobTypeRequired=jobTypeRequired.split(",")
  }
  

  
    if(locationRequired!=undefined || locationRequired!=null){
     locationRequired=locationRequired.toString();
     locationRequired=locationRequired.split(",")
   }
  

  
   if(subjectRequired!=undefined || subjectRequired!=null){
    subjectRequired=subjectRequired.toString();
    subjectRequired=subjectRequired.split(",")
   }
 
  
  
    if(titleRequired!=undefined || titleRequired!=null){
      titleRequired=titleRequired.toString();
      titleRequired=titleRequired.split(",")
    }
  
  
  
   if(categoryRequired!=undefined || categoryRequired!=null){
    categoryRequired=categoryRequired.toString();
    categoryRequired=categoryRequired.split(",")
   }
  

  
  if(salaryRangeRequired!=undefined || salaryRangeRequired!=null){
   salaryRangeRequired=salaryRangeRequired.toString();
   salaryRangeRequired=salaryRangeRequired.split(",") 
  }


 
  if(specialityRequired!=undefined || specialityRequired!=null){
    specialityRequired=specialityRequired.toString();
    specialityRequired=specialityRequired.split(",")
  }
 

 
  if(weekHoursRequired!=undefined || weekHoursRequired!=null){
    weekHoursRequired=weekHoursRequired.toString();
    weekHoursRequired=weekHoursRequired.split(",")
 
}


  if(availabilityRequired!=undefined || availabilityRequired!=null){
    availabilityRequired=availabilityRequired.toString();
    availabilityRequired=availabilityRequired.split(",");
  }



let searchArguments=new Array();

searchArguments.push(experienceLevelRequired);
searchArguments.push(jobTypeRequired);
searchArguments.push(locationRequired);
searchArguments.push(subjectRequired);
searchArguments.push(titleRequired);
searchArguments.push(categoryRequired);
searchArguments.push(salaryRangeRequired);
searchArguments.push(specialityRequired);
searchArguments.push(weekHoursRequired);
searchArguments.push(availabilityRequired);




  
  

 let data1=await userService.matchedCandidatesForClientHomePage(user,...searchArguments)
  res.status(200).send({status:true,message:data1})
//  res.sendJSONResponse({
  
//   code:httpStatus.OK,
//   status: true,
//   message: utility.getWebAppMessages('jobMessage.CandidateRecommendedForClientSuccess'),
//   data: {result:data1}

// })

})

const matchedClientsForCandidateHomePage=catchAsync(async(req,res)=>{

  let user=req.user;
  let descriptionRequired=req.query.description;
  let categoryRequired=req.query.category;
  let typeRequired=req.query.type;
  let locationRequired=req.query.location;
  let salaryTypeRequired=req.query.salaryType;
  let nursingHomeRequired=req.query.nursingHome;
  let bilisterPacksRequired=req.query.bilisterPacks;
  let methadoneRequired=req.query.methadone;
  let itemsPerDayRequired=req.query.itemsPerDay;
  let weekHoursRequired=req.query.weekHours;
  let availableDaysRequired=req.query.availability;
  let specialityRequired=req.query.speciality;
  let cityRequired=req.query.city;


  if(descriptionRequired!=undefined || descriptionRequired!=null){
    descriptionRequired=descriptionRequired.toString();
    descriptionRequired=descriptionRequired.split(",")
  }

  if(categoryRequired!=undefined || categoryRequired!=null){
    categoryRequired=categoryRequired.toString();
    categoryRequired=categoryRequired.split(",")
  }

  if(typeRequired!=undefined || typeRequired!=null){
    typeRequired=typeRequired.toString();
    typeRequired=typeRequired.split(",")
  }

  if(locationRequired!=undefined || locationRequired!=null){
    locationRequired=locationRequired.toString();
    locationRequired=locationRequired.split(",")
  }

  if(salaryTypeRequired!=undefined || salaryTypeRequired!=null){
    salaryTypeRequired=salaryTypeRequired.toString();
    salaryTypeRequired=salaryTypeRequired.split(",")
  }

  if(nursingHomeRequired!=undefined || nursingHomeRequired!=null){
    nursingHomeRequired=nursingHomeRequired.toString();
    nursingHomeRequired=nursingHomeRequired.split(",")
  }

  if(bilisterPacksRequired!=undefined || bilisterPacksRequired!=null){
    bilisterPacksRequired=bilisterPacksRequired.toString();
    bilisterPacksRequired=bilisterPacksRequired.split(",")
  }

  if(methadoneRequired!=undefined || methadoneRequired!=null){
    methadoneRequired=methadoneRequired.toString();
    methadoneRequired=methadoneRequired.split(",")
  }

  if(itemsPerDayRequired!=undefined || itemsPerDayRequired!=null){
    itemsPerDayRequired=itemsPerDayRequired.toString();
    itemsPerDayRequired=itemsPerDayRequired.split(",")
  }

  if(weekHoursRequired!=undefined || weekHoursRequired!=null){
    weekHoursRequired=weekHoursRequired.toString();
    weekHoursRequired=weekHoursRequired.split(",")
  }

  if(availableDaysRequired!=undefined || availableDaysRequired!=null){
    availableDaysRequired=availableDaysRequired.toString();
    availableDaysRequired=availableDaysRequired.split(",")
  }

  if(specialityRequired!=undefined || specialityRequired!=null){
    specialityRequired=specialityRequired.toString();
    specialityRequired=specialityRequired.split(",")
  }

  if(cityRequired!=undefined || cityRequired!=null){
    cityRequired=cityRequired.toString();
    cityRequired=cityRequired.split(",")
  }

  let searchArguments=[];
  searchArguments.push(descriptionRequired);
  searchArguments.push(categoryRequired);
  searchArguments.push(typeRequired);
  searchArguments.push(locationRequired);
  searchArguments.push(salaryTypeRequired);
  searchArguments.push(nursingHomeRequired);
  searchArguments.push(bilisterPacksRequired);
  searchArguments.push(methadoneRequired);
  searchArguments.push(itemsPerDayRequired);
  searchArguments.push(weekHoursRequired);
  searchArguments.push(availableDaysRequired);
  searchArguments.push(specialityRequired);
  searchArguments.push(cityRequired);
  let data1=await userService.matchedClientsForCandidateHomePage(user,...searchArguments);
//  res.status(200).send({status:true,message:data1})
  res.sendJSONResponse({
   
   code:httpStatus.OK,
   status: true,
   message: utility.getWebAppMessages('jobMessage.ClientRecommendedForCandidateSuccess'),
   results: data1
 
 })

  
 
 })


 const getSpecificCandidate=catchAsync(async (req,res)=>{

  let user=req.user;
  let objectId1=req.query.objectId;
  
  let data1=await userService.getSpecificCandidateDetails(objectId1);
  
  res.sendJSONResponse({
    
    code:httpStatus.OK,
    status: true,
    message:utility.getWebAppMessages('jobMessage.specificCandidateGetSuccess'),
    data: {result:data1}
  
  })
  
  
  })


  const getSpecificJob = catchAsync(async (req, res) => {
 
    let user=req.user;
    let objectId1=req.query.objectId;
  
    let data1=await userService.getSpecificJobDetails(objectId1);
  
    res.sendJSONResponse({
  
      code: httpStatus.OK,
      status: true,
      message: utility.getWebAppMessages('jobMessage.specificJobGetSuccess'),
      data:{result:data1}
  
    })
  
  
  })



module.exports = {
  createUser,
  getUsers,
  getUser,
  updateUser,
  deleteUser,
  clientHomePage,
  candidateHomePage,
  matchedCandidatesForClientHomePage,
  matchedClientsForCandidateHomePage,
  getSpecificCandidate,
  getSpecificJob
}
