const httpStatus = require('http-status');
const { Token,User, UserDetail, preference} = require('../../../models');
const Perefrence=require('../../../models/prefrence.model')
const favouriteCandidate=require('../../../models/favouriteCandidate.model')
const favouriteJob=require('../../../models/favouriteJob.model');
const ApiError = require('../../../utils/ApiError');
const jobDetail=require('../../../models/jobDetail.model');
const tokenService = require('./token.service');

/**
 * Create a user
 * @param {Object} userBody
 * @returns {Promise<User>}
 */
const createUser = async (userBody) => {
  if (await User.isEmailTaken(userBody.email)) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Email already taken');
  }
  const { email, mobileNumber, password, role } = userBody;
  const userObj = { email, mobileNumber, password, role };

  const userDetails = {
    ...userBody.userDetails,
  };

  const user = await User.create(userObj);

  const userDetail = await UserDetail.create({ ...userDetails, userId: user._id });

  return { user, userDetail };
};

/**
 * Query for users
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */
const queryUsers = async (filter, options) => {
  const users = await User.paginate(filter, options);
  return users;
};

/**
 * Get user by id
 * @param {ObjectId} id
 * @returns {Promise<User>}
 */
const getUserById = async (id) => {
  return User.findById(id);
};

/**
 * Get user by email
 * @param {string} email
 * @returns {Promise<User>}
 */
const getUserByEmail = async (email) => {
  const user = User.findOne({ email }).populate('userDetails');

  // const data = await User.aggregate([
  //   {
  //     $match: {
  //       email,
  //     },
  //   },
  //   {
  //     $lookup: {
  //       from: 'userdetails',
  //       localField: '_id',
  //       foreignField: 'userId',
  //       as: 'userDetail',
  //     },
  //   },
  //   {
  //     $unwind: {
  //       path: '$userDetail',
  //     },
  //   },
  // ]);
  return user;
};

/**
 * Update user by id
 * @param {ObjectId} userId
 * @param {Object} updateBody
 * @returns {Promise<User>}
 */
const updateUserById = async (userId, updateBody) => {
  const user = await getUserById(userId);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }
  if (updateBody.email && (await User.isEmailTaken(updateBody.email, userId))) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Email already taken');
  }
  Object.assign(user, updateBody);
  await user.save();
  return user;
};

/**
 * Delete user by id
 * @param {ObjectId} userId
 * @returns {Promise<User>}
 */
const deleteUserById = async (userId) => {
  const user = await getUserById(userId);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }
  await user.remove();
  return user;
};

const candidateHomePage = async (user) => {

  
 
  if(user.role!="candidate") throw new ApiError(httpStatus.UNAUTHORIZED, 'user is not a candidate');

  let userId=user._id;

 
  if(user.isPrefrenceSet===false) throw new ApiError(httpStatus.BAD_REQUEST, "Preference is not set for this candidate");
 
  let candidatePreferenceData= await Perefrence.findOne({userId:userId});
 
  if(!candidatePreferenceData) throw new ApiError(httpStatus.BAD_REQUEST,"candidate preference data is not available");

 
  let candidateDetails= await UserDetail.findOne({userId:userId});
 
  if(!candidateDetails) throw new ApiError(httpStatus.BAD_REQUEST,"candidate detail is not available")
  
 
 let speciality=candidatePreferenceData.speciality;
 let country=candidateDetails.nationality;;
 let availability=candidatePreferenceData.availability;
 let firstName=candidateDetails.firstName;
 let jobType=candidatePreferenceData.jobType;
 let salaryType=candidatePreferenceData.salaryType;
 let salaryRange=candidatePreferenceData.salaryRange;
 let travelDistance=candidatePreferenceData.travelDistance;
 let jobCategory=candidatePreferenceData.jobCategory;
 let header=new Object();
 header.speciality=speciality;;
 header.country=country;
 header.availability=availability;
 let section=new Object();
   
 let date=new Date();
 let todayDay=date.getDay();
 let dayDate=date.getDate();
 let m=date.getMonth();
 let todayDate=date.getDate();
 const month={
 1:"January",
 2:"February",
 3:"March",
 4:"April",
 5:"May",
 6:"June",
 7:"July",
 8:"August",
 9:"September",
 10:"October",
 11:"November",
 12:"December"
 }
 
 const day={
 1:"Monday",
 2:"Tuesday",
 3:"Wednesday",
 4:"Thursday",
 5:"Friday",
 6:"Saturday",
 7:"Sunday"
 }
 
 for(let i in day)
 {
  if(todayDay==i)
  {
   i;
   dayDate=day[i];
  }
 }
 
 for(let i in month)
 {
  if(i==m){
  i++
  m=month[i];
  }
 }
 let today=dayDate+""+","+m+" "+todayDate+"th";
 section.today=today;
 section.information="Good Evening"+" "+firstName;
 
let clientsList=await User.find({role:"client"});

let clientsId=[];

for(let i=0;i<clientsList.length;i++){
  
  clientsId.push(clientsList[i]._id.toString());

}

// clientsList.forEach(function(client){
//  clientsId.push(client._id)
// })

let jobDetails=await jobDetail.find({clientId:{$in:clientsId}})

let jobDetailsId=[];

for(let i=0;i<jobDetails.length;i++){
  jobDetailsId.push(jobDetails[i]._id.toString());
}

// jobDetails.forEach(function(job){
//  console.log(job._id);
//  jobDetailsId.push(job._id.toString());

// })

let index=0;
let clients=[];
clients[index]=new Object();

for(let i=0;i<jobDetailsId.length;i++){

     let jobId=jobDetailsId[i];
     console.log(jobId);

     if(jobId!==null && jobId!==undefined){

     let jobDetails=await jobDetail.findOne({_id:jobId}).select({description:1,salaryRange:1,clientId:1,title:1,location:1,subject:1});

     if(jobDetails!==null && jobDetails!==undefined){

      let clientId=jobDetails.clientId;

      if(clientId!==null && clientId!==undefined){
      
      let basicDetails=await UserDetail.findOne({userId:clientId})
      
      if(basicDetails!=null && basicDetails!==undefined){

      let myClientPreferences=await Perefrence.findOne({userId:clientId}).select({speciality:1});

      if(myClientPreferences!==null && myClientPreferences!==undefined){
        console.log("hello world");
        let EstBudget=jobDetails.salaryRange;

        let speciality=myClientPreferences.speciality;
      
        let salaryType=jobDetails.salaryType;
      
        let title=jobDetails.title;
      
        let location=jobDetails.location;
      
        clients[index].subject=jobDetails.subject;
      
        clients[index].description=jobDetails.description;
      
        clients[index].type=salaryType+"-"+speciality+"-"+EstBudget;
      
        clients[index].information=title+" "+speciality+" "+location;
      
        clients[index].updatedAt=jobDetails.updatedAt;
        index++;
        clients[index]=new Object();
      }
     }
     }
     }

     }
}



let bestMatches=clients;

let mostRecent=clients.sort(function(a,b){
 
  if(a.updatedAt<b.updatedAt) return 1;
  if(a.updatedAt>b.updatedAt) return -1;
  return 0;
})



for(let i=0;i<bestMatches.length;i++)
 {
  delete bestMatches[i].updatedAt;

 }



 let savedClients=bestMatches;
//  if(bestMatches.length){  
//  bestMatches.length=bestMatches.length-1;
//  }

//  if(mostRecent.length){
//  mostRecent.length=mostRecent.length-1;
//  }
//  console.log(mostRecent.length);
//  if(savedClients.length){
//  savedClients.length=savedClients.length-1;
//  }
//  console.log(mostRecent.length);
//  bestMatches=bestMatches.splice(0,30);
//  mostRecent=mostRecent.splice(0,30);

let recommendedClients=new Object();

recommendedClients.intro="Browse candidates that match your requirements and job preferences.Ordered by most relevant";

recommendedClients.bestMatches=bestMatches;
recommendedClients.mostRecent=mostRecent;
recommendedClients.savedClients=savedClients;

let newObject=new Object();
newObject.header=header;
newObject.section=section;
newObject.recommendedCandidates=recommendedClients;


  
  return newObject;;
}


const clientHomePage = async (user) => {

  if(user.role!="client") throw new ApiError(httpStatus.UNAUTHORIZED, 'user is not a client');

  let userId=user._id;

 
  if(user.isPrefrenceSet===false) throw new ApiError(httpStatus.BAD_REQUEST, "Preference is not set for this client");
 
  let clientPreferenceData= await Perefrence.findOne({userId:userId});
 
  if(!clientPreferenceData) throw new ApiError(httpStatus.BAD_REQUEST,"client preference data is not available");

 
  let clientDetails= await UserDetail.findOne({userId:userId});
 
  if(!clientDetails) throw new ApiError(httpStatus.BAD_REQUEST,"client detail is not available")
  
 
 let speciality=clientPreferenceData.speciality;
 let country=clientDetails.nationality;;
 let availability=clientPreferenceData.availability;
 let firstName=clientDetails.firstName;
 let jobType=clientPreferenceData.jobType;
 let salaryType=clientPreferenceData.salaryType;
 let salaryRange=clientPreferenceData.salaryRange;
 let travelDistance=clientPreferenceData.travelDistance;
 let jobCategory=clientPreferenceData.jobCategory;
 let header=new Object();
 header.speciality=speciality;;
 header.country=country;
 header.availability=availability;
 let section=new Object();
   
 let date=new Date();
 let todayDay=date.getDay();
 let dayDate=date.getDate();
 let m=date.getMonth();
 let todayDate=date.getDate();
 const month={
 1:"January",
 2:"February",
 3:"March",
 4:"April",
 5:"May",
 6:"June",
 7:"July",
 8:"August",
 9:"September",
 10:"October",
 11:"November",
 12:"December"
 }
 
 const day={
 1:"Monday",
 2:"Tuesday",
 3:"Wednesday",
 4:"Thursday",
 5:"Friday",
 6:"Saturday",
 7:"Sunday"
 }
 
 for(let i in day)
 {
  if(todayDay==i)
  {
   i;
   dayDate=day[i];
  }
 }
 
 for(let i in month)
 {
  if(i==m){
  i++
  m=month[i];
  }
 }
 let today=dayDate+""+","+m+" "+todayDate+"th";
 section.today=today;
 section.information="Good Evening"+" "+firstName;
 
let candidatesList=await User.find({role:"candidate"});

let candidatesId=[];
 candidatesList.forEach(function(candidate){
 candidatesId.push(candidate._id.toString())
})



let index=0;
let candidates=[];
candidates[index]=new Object();

for(let i=0;i<candidatesId.length;i++){

let userId=candidatesId[i];

if(userId!==null && userId!==undefined){

let candidateBasicDetails = await UserDetail.findOne({userId:userId}).select({firstName:1,lastName:1,nationality:1,userId:1,title:1});

if(candidateBasicDetails!==null && candidateBasicDetails!==undefined){

  let candidatePreferenceDetails=await Perefrence.findOne({userId:userId}).select({salaryRange:1,jobCategory:1,speciality:1,availability:1,userId:1,updatedAt:1})

  if(candidatePreferenceDetails!==null && candidatePreferenceDetails!==undefined){
   
    let title=candidateBasicDetails.title;
    let firstName=candidateBasicDetails.firstName;
    let lastName=candidateBasicDetails.lastName;
    let candidateName=title+" "+firstName+" "+lastName;
    let salaryRange=candidatePreferenceDetails.salaryRange;
    let category=candidatePreferenceDetails.jobCategory;
    let speciality=candidatePreferenceDetails.speciality;
    let country=candidateBasicDetails.nationality;
    let availability=candidatePreferenceDetails.availability
    candidates[index].name=candidateName+"-"+salaryRange;
    candidates[index].jobCategory=category;
    candidates[index].information=category+" "+availability+" "+country+" "+speciality;
    candidates[index].updatedAt=candidatePreferenceDetails.updatedAt;
    index++;
    candidates[index]=new Object();

  }

}

}

}


let bestMatches=candidates;

let mostRecent=candidates.sort(function(a,b){
 
  if(a.updatedAt<b.updatedAt) return 1;
  if(a.updatedAt>b.updatedAt) return -1;
  return 0;
})


for(let i=0;i<bestMatches.length;i++)
 {
  delete bestMatches[i].updatedAt;

 }

 savedCandidate=bestMatches;
//  bestMatches.length=bestMatches.length-1;
//  mostRecent.length=mostRecent.length-1;
//  savedCandidate.length=savedCandidate.length-1;
//  bestMatches.splice(0,10);
//  mostRecent.splice(0,10);
 

let recommendedCandidates=new Object();

recommendedCandidates.intro="Browse candidates that match your requirements and job preferences.Ordered by most relevant";

recommendedCandidates.bestMatches=bestMatches;
recommendedCandidates.mostRecent=mostRecent;
recommendedCandidates.savedCandidates=savedCandidate;


let newObject=new Object();
newObject.header=header;
newObject.section=section;
newObject.recommendedCandidates=recommendedCandidates;


  
  return newObject;;


}


const matchedCandidatesForClientHomePage = async function(user,...searchParameters){

  if(user.role!="client") throw new ApiError(httpStatus.UNAUTHORIZED, 'user is not a client');

  let userId=user._id;


  
  if(user.isPrefrenceSet===false) throw new ApiError(httpStatus.BAD_REQUEST, "Preference is not set for this client");
 
  let clientPreferenceData= await Perefrence.findOne({userId:userId});
 
  if(!clientPreferenceData) throw new ApiError(httpStatus.BAD_REQUEST,"client preference data is not available");

 
  let clientDetails= await UserDetail.findOne({userId:userId});
 
  if(!clientDetails) throw new ApiError(httpStatus.BAD_REQUEST,"client detail is not available")
  
 
 let speciality=clientPreferenceData.speciality;
 let country=clientDetails.nationality;;
 let availability=clientPreferenceData.availability;
 let firstName=clientDetails.firstName;
 let jobType=clientPreferenceData.jobType;
 let salaryType=clientPreferenceData.salaryType;
 let salaryRange=clientPreferenceData.salaryRange;
 let travelDistance=clientPreferenceData.travelDistance;
 let jobCategory=clientPreferenceData.jobCategory;
 let header=new Object();
 header.speciality=speciality;;
 header.country=country;
 header.availability=availability;
 let section=new Object();
   
 let date=new Date();
 let todayDay=date.getDay();
 let dayDate=date.getDate();
 let m=date.getMonth();
 let todayDate=date.getDate();
 const month={
 1:"January",
 2:"February",
 3:"March",
 4:"April",
 5:"May",
 6:"June",
 7:"July",
 8:"August",
 9:"September",
 10:"October",
 11:"November",
 12:"December"
 }
 
 const day={
 1:"Monday",
 2:"Tuesday",
 3:"Wednesday",
 4:"Thursday",
 5:"Friday",
 6:"Saturday",
 7:"Sunday"
 }
 
 for(let i in day)
 {
  if(todayDay==i)
  {
   i;
   dayDate=day[i];
  }
 }
 
 for(let i in month)
 {
  if(i==m){
  i++
  m=month[i];
  }
 }
 let today=dayDate+""+","+m+" "+todayDate+"th";
 section.today=today;
 section.information="Good Evening"+" "+firstName;
 
 
 let [jobTypeRequired,experienceLevelRequired,locationRequired,subjectRequired,titleRequired,categoryRequired,salaryRangeRequired,specialityRequired,weekHoursRequired,availabilityRequired
 ]=[...searchParameters];
 
 let commonData=await Perefrence.find({$or:[{speciality:{$eq:speciality}},{availability:{$eq:availability}},{jobType:{$eq:jobType}},{salaryType:{$eq:salaryType}},{salaryRange:{$eq:salaryRange}},{travelDistance:{$eq:travelDistance}},{jobCategory:{$eq:jobCategory}}]});
   
 
  let candidateAndClientPreferenceId=[];
   
  commonData.forEach(function(clientAndCandidate){
    candidateAndClientPreferenceId.push(clientAndCandidate.userId.toString())
  })
   
 let myCandidates=await User.find({$and:[{_id:{$in:candidateAndClientPreferenceId}},{role:{$eq:"candidate"}}]});

 let myCandidatesId=[];
 myCandidates.forEach(function(candidate){
  
  myCandidatesId.push(candidate._id.toString())

 })
  
  let candidateAndClientDetailData=await UserDetail.find({userId:{$in:myCandidatesId}}).sort({updatedAt:1});
 
 
  let candidateAndClientDetailId=[];
 
  candidateAndClientDetailData.forEach(function(candidateAndClient){
     
   candidateAndClientDetailId.push(candidateAndClient.userId.toString());
 
  })
 
  let savedCandidate=await favouriteCandidate.find({clientId:userId}).sort({updatedAt:1});
 
  let savedCandidateId=[];
  
  savedCandidate.forEach(function(candidate){
      
   savedCandidateId.push(candidate.candidateId);
  })
  
 
 let index=0;
 let bestMatches=[];
 bestMatches[index]=new Object();
 let mostRecent=[];
 mostRecent[index]=new Object();
 let recommendedCandidates=new Object();
 
 
 
 
 for(let i=0;i<myCandidatesId.length;i++){
 
       let userId=myCandidatesId[i];

       if(userId!==null && userId!==undefined){

      let candidateBasicDetails = await UserDetail.findOne({userId:userId})

      if(candidateBasicDetails!==null && candidateBasicDetails!==undefined){

      let candidatePreferenceDetails=await Perefrence.findOne({userId:userId})
       
      if(candidatePreferenceDetails!==null && candidatePreferenceDetails!==undefined){ 
        bestMatches[index].title=candidateBasicDetails.title;
        bestMatches[index].firstName=candidateBasicDetails.firstName;
        bestMatches[index].lastName=candidateBasicDetails.lastName;
        bestMatches[index].nationality=candidateBasicDetails.nationality;
        bestMatches[index].eirCode=candidateBasicDetails.eirCode;
        bestMatches[index].address=candidateBasicDetails.address;
        bestMatches[index].userId=candidateBasicDetails.userId;
        bestMatches[index].travelDistance=candidatePreferenceDetails.travelDistance;
        bestMatches[index].updatedAt=candidatePreferenceDetails.updatedAt;
        bestMatches[index].jobType=candidatePreferenceDetails.jobType;
        bestMatches[index].jobCategory=candidatePreferenceDetails.jobCategory;
        bestMatches[index].speciality=candidatePreferenceDetails.speciality;
        bestMatches[index].weekHours=candidatePreferenceDetails.weekHours;
        bestMatches[index].salaryType=candidatePreferenceDetails.salaryType
        bestMatches[index].salaryRange=candidatePreferenceDetails.salaryRange;
        bestMatches[index].availability=candidatePreferenceDetails.availability;
        bestMatches[index].experience=candidatePreferenceDetails.experience;
        index++;
        bestMatches[index]=new Object();
      }
      }
 
       }
}

let newBestMatches=[];
if(jobTypeRequired!=undefined){
 
 if(jobTypeRequired.length>0){

   bestMatches.filter(function(obj){
    jobTypeRequired.filter(function(job){
      if(obj.jobType==job)
      newBestMatches.push(obj);
   })
  })
 }
}

 if(experienceLevelRequired!=undefined){
   if(experienceLevelRequired.length>0){

     bestMatches.filter(function(obj){
      experienceLevelRequired.filter(function(experience){

       if(obj.experience==experience)
       newBestMatches.push(obj);

      })
     })
   }
 }

 if(locationRequired!=undefined){
   if(locationRequired.length>0){

     bestMatches.filter(function(obj){
      locationRequired.filter(function(location){

       if(obj.location==location)
       newBestMatches.push(obj);

      })
     })
   }
 }

 if(subjectRequired!=undefined){
   if(subjectRequired.length>0){

     bestMatches.filter(function(obj){
      subjectRequired.filter(function(subject){

       if(obj.subject==subject)
       newBestMatches.push(obj);

      })
     })
   }
 }

 if(titleRequired!=undefined){
   if(titleRequired.length>0){

     bestMatches.filter(function(obj){
      titleRequired.filter(function(title){

       if(obj.title==title)
       newBestMatches.push(obj);

      })
     })
   }
 }
 
 if(categoryRequired!=undefined){
   if(categoryRequired.length>0){

     bestMatches.filter(function(obj){
      categoryRequired.filter(function(category){

       if(obj.jobCategory==category)
       newBestMatches.push(obj);

      })
     })
   }
 }

 if(salaryRangeRequired!=undefined){
   if(salaryRangeRequired.length>0){

     bestMatches.filter(function(obj){
      salaryRangeRequired.filter(function(salaryRange){

       if(obj.salaryRange==salaryRange)
       newBestMatches.push(obj);

      })
     })
   }
 }

 
 if(specialityRequired!=undefined){
   if(specialityRequired.length>0){
      bestMatches.filter(function(obj){
      specialityRequired.filter(function(speciality){
      if(obj.speciality==speciality)
       newBestMatches.push(obj);
       
      })
      
     })
     
   }
 }
      
 if(weekHoursRequired!=undefined){
   if(weekHoursRequired.length>0){

     bestMatches.filter(function(obj){
      weekHoursRequired.filter(function(weekHours){

       if(obj.weekHours==weekHours)
       newBestMatches.push(obj);

      })
     })
   }
 }

 if(availabilityRequired!=undefined){
   if(availabilityRequired.length>0){

     bestMatches.filter(function(obj){
      availabilityRequired.filter(function(availability){

       if(obj.availability==availability)
       newBestMatches.push(obj);

      })
     })
   }
 }
   
 //-------------------loop ends here................
 
 let savedCandidatesList=await favouriteCandidate.find({clientId:userId}).sort({updatedAt:1});
 
 let savedCandidatesId=[];
 let count=0;
 let savedCandidates=[];
 savedCandidates[count]=new Object();

 savedCandidatesList.forEach(function(candidate){
  
   savedCandidatesId.push(candidate.candidateId);
 
 })
 
 
 
 
 for(let i=0;i<savedCandidatesId.length;i++){
   
  let userId=savedCandidatesId[i];
  if(userId!==undefined && userId!==null){
  
  let candidateBasicDetails = await UserDetail.findOne({userId:userId})
  
  if(candidateBasicDetails!==null && candidateBasicDetails!==undefined){

   let candidatePreferenceDetails=await Perefrence.findOne({userId:userId})
  
  if(candidatePreferenceDetails!==null && candidatePreferenceDetails!==undefined){

  savedCandidates[count].title=candidateBasicDetails.title;
  savedCandidates[count].firstName=candidateBasicDetails.firstName;
  savedCandidates[count].lastName=candidateBasicDetails.lastName;
  savedCandidate[count].nationality=candidateBasicDetails.nationality;
  savedCandidate[count].eirCode=candidateBasicDetails.eirCode;
  savedCandidate[count].address=candidateBasicDetails.address;
  savedCandidate[count].userId=candidateBasicDetails.userId;
  savedCandidate[count].travelDistance=candidatePreferenceDetails.travelDistance;
  savedCandidate[count].updatedAt=candidatePreferenceDetails.updatedAt;
  savedCandidate[count].jobType=candidatePreferenceDetails.jobType;
  savedCandidate[count].jobCategory=candidatePreferenceDetails.jobCategory;
  savedCandidate[count].speciality=candidatePreferenceDetails.speciality;
  savedCandidate[count].weekHours=candidatePreferenceDetails.weekHours;
  savedCandidate[count].salaryType=candidatePreferenceDetails.salaryType
  savedCandidate[count].salaryRange=candidatePreferenceDetails.salaryRange;
  savedCandidate[count].availability=candidatePreferenceDetails.availability;
  savedCandidate[count].experienceLevel=candidatePreferenceDetails.experienceLevel;
  count++;
  savedCandidates[count]=new Object();
  
  }
  }
  }

  }  

 let newSavedCandidates=[];
 if(jobTypeRequired!==undefined){
  
  if(jobTypeRequired.length>0){

    savedCandidates.filter(function(obj){
     jobTypeRequired.filter(function(job){
       if(obj.jobType===job)
       newSavedCandidates.push(obj);
    })
   })
  }
}
  if(experienceLevelRequired!==undefined){
    if(experienceLevelRequired.length>0){

      savedCandidates.filter(function(obj){
       experienceLevelRequired.filter(function(experience){

        if(obj.experience===experience)
        newSavedCandidates.push(obj);

       })
      })
    }
  }
 
  if(locationRequired!==undefined){
    if(locationRequired.length>0){

      savedCandidates.filter(function(obj){
       locationRequired.filter(function(location){

        if(obj.location===location)
        newSavedCandidates.push(obj);

       })
      })
    }
  }

  if(subjectRequired!==undefined){
    if(subjectRequired.length>0){

      savedCandidates.filter(function(obj){
       subjectRequired.filter(function(subject){

        if(obj.subject===subject)
        newSavedCandidates.push(obj);

       })
      })
    }
  }

  if(titleRequired!==undefined){
    if(titleRequired.length>0){

      savedCandidates.filter(function(obj){
       titleRequired.filter(function(title){

        if(obj.title===title)
        newSavedCandidates.push(obj);

       })
      })
    }
  }
  
  if(categoryRequired!==undefined){
    if(categoryRequired.length>0){

      savedCandidates.filter(function(obj){
       categoryRequired.filter(function(category){

        if(obj.jobCategory===category)
        newSavedCandidates.push(obj);

       })
      })
    }
  }

  if(salaryRangeRequired!==undefined){
    if(salaryRangeRequired.length>0){

      savedCandidates.filter(function(obj){
       salaryRangeRequired.filter(function(salaryRange){

        if(obj.salaryRange===salaryRange)
        newSavedCandidates.push(obj);

       })
      })
    }
  }

  if(specialityRequired!==undefined){
    if(specialityRequired.length>0){

      savedCandidates.filter(function(obj){
       specialityRequired.filter(function(speciality){

        if(obj.speciality===speciality)
        newSavedCandidates.push(obj);

       })
      })
    }
  }

  if(weekHoursRequired!==undefined){
    if(weekHoursRequired.length>0){

      savedCandidates.filter(function(obj){
       weekHoursRequired.filter(function(weekHours){

        if(obj.weekHours===weekHours)
        newSavedCandidates.push(obj);

       })
      })
    }
  }

  if(availabilityRequired!==undefined){
    if(availabilityRequired.length>0){

      savedCandidates.filter(function(obj){
       availabilityRequired.filter(function(availability){

        if(obj.availability===availability)
        newSavedCandidates.push(obj);

       })
      })
    }
  }
  

 



 mostRecent=bestMatches.sort(function(a,b){
 
  if(a.updatedAt<b.updatedAt) return 1;
  if(a.updatedAt>b.updatedAt) return -1;
  return 0;
 

 })

 let newMostRecent=[];
 
if(jobTypeRequired!==undefined){
  
  if(jobTypeRequired.length>0){

    mostRecent.filter(function(obj){
     jobTypeRequired.filter(function(job){
       if(obj.jobType===job)
       newMostRecent.push(obj);
    })
   })
  }
}
  if(experienceLevelRequired!==undefined){
    if(experienceLevelRequired.length>0){

      mostRecent.filter(function(obj){
       experienceLevelRequired.filter(function(experience){

        if(obj.experience===experience)
        newMostRecent.push(obj);

       })
      })
    }
  }
 
  if(locationRequired!==undefined){
    if(locationRequired.length>0){

      mostRecent.filter(function(obj){
       locationRequired.filter(function(location){

        if(obj.location===location)
        newMostRecent.push(obj);

       })
      })
    }
  }

  if(subjectRequired!==undefined){
    if(subjectRequired.length>0){

      mostRecent.filter(function(obj){
       subjectRequired.filter(function(subject){

        if(obj.subject===subject)
        newMostRecent.push(obj);

       })
      })
    }
  }

  if(titleRequired!==undefined){
    if(titleRequired.length>0){

      mostRecent.filter(function(obj){
       titleRequired.filter(function(title){

        if(obj.title===title)
        newMostRecent.push(obj);

       })
      })
    }
  }
  
  if(categoryRequired!==undefined){
    if(categoryRequired.length>0){

      mostRecent.filter(function(obj){
       categoryRequired.filter(function(category){

        if(obj.jobCategory===category)
        newMostRecent.push(obj);

       })
      })
    }
  }

  if(salaryRangeRequired!==undefined){
    if(salaryRangeRequired.length>0){

      mostRecent.filter(function(obj){
       salaryRangeRequired.filter(function(salaryRange){

        if(obj.salaryRange===salaryRange)
        newMostRecent.push(obj);

       })
      })
    }
  }

  if(specialityRequired!==undefined){
    if(specialityRequired.length>0){
      mostRecent.filter(function(obj){
       specialityRequired.filter(function(speciality){
        if(obj.speciality===speciality)
        newMostRecent.push(obj);

       })
      })
    }
  }


  if(weekHoursRequired!==undefined){
    if(weekHoursRequired.length>0){

      mostRecent.filter(function(obj){
       weekHoursRequired.filter(function(weekHours){

        if(obj.weekHours===weekHours)
        newMostRecent.push(obj);

       })
      })
    }
  }

  if(availabilityRequired!==undefined){
   if(availabilityRequired.length>0){
      mostRecent.filter(function(obj){

       availabilityRequired.filter(function(availability){
        if(obj.availability===availability)
        newMostRecent.push(obj);

       })
      })
    }
  }


 
 if(bestMatches.length>0){

 for(let i=0;i<bestMatches.length;i++)
 {
  delete bestMatches[i].updatedAt;

 }
}
//  bestMatches.length=bestMatches.length-1;
//  mostRecent.length=mostRecent.length-1;
//  savedCandidates.length=savedCandidates.length-1;
//  bestMatches.splice(0,10);
//  mostRecent.splice(0,10);

 recommendedCandidates.intro="Browse candidates that match your requirements and job preferences.Ordered by most relevant";



  
 
 //.............savedCandidates complete
 let x=0;
 if(searchParameters){
 for(let i=0;i<searchParameters.length;i++){
  if(searchParameters[i]){
  for(let j=0;j<searchParameters[i].length;j++){
    if(searchParameters[i][j]!==undefined || searchParameters[i][j]!==null)
      x++;
  }
  
 }
}
}
 let finalBestMatches=[];
 let finalSavedCandidates=[];
 let finalMostRecent=[];
 if(x>0)
 {
  if(newBestMatches.length>0){
  for(let i=0;i<newBestMatches.length;i++)
  {

  if(Object.keys(newBestMatches[i]).length >0)
  {
  finalBestMatches[i]=new Object();
  let title=newBestMatches[i].title;
  let firstName=newBestMatches[i].firstName;
  let lastName=newBestMatches[i].lastName;
  let candidateName=title+" "+firstName+" "+lastName;
  let salaryRange=newBestMatches[i].salaryRange;
  let category=newBestMatches[i].jobCategory;
  let speciality=newBestMatches[i].speciality;
  let country=newBestMatches[i].nationality;
  let availability=newBestMatches[i].availability
  finalBestMatches[i].name=candidateName+"-"+salaryRange;
  finalBestMatches[i].jobCategory=category;
  finalBestMatches[i].information=category+" "+availability+" "+country+" "+speciality;
  finalBestMatches[i].updatedAt=newBestMatches[i].updatedAt;
  }
 }
  }
  if(newSavedCandidates.length>0){
 for(let i=0;i<newSavedCandidates.length;i++)
 {
  finalSavedCandidates[i]=new Object();
 let title=newSavedCandidates[i].title;
 let firstName=newSavedCandidates[i].firstName;
 let lastName=newSavedCandidates[i].lastName;
 let candidateName=title+" "+firstName+" "+lastName;
 let salaryRange=newSavedCandidates[i].salaryRange;
 let category=newSavedCandidates[i].jobCategory;
 let speciality=newSavedCandidates[i].speciality;
 let country=newSavedCandidates[i].nationality;
 let availability=newSavedCandidates[i].availability
 finalSavedCandidates[i].name=candidateName+"-"+salaryRange;
 finalSavedCandidates[i].jobCategory=category;
 finalSavedCandidates[i].information=category+" "+availability+" "+country+" "+speciality;
 finalSavedCandidates[i].updatedAt=newSavedCandidates[i].updatedAt;
}
 }
if(newMostRecent.length>0){
for(let i=0;i<newMostRecent.length;i++)
{
finalMostRecent[i]=new Object();
let title=newMostRecent[i].title;
let firstName=newMostRecent[i].firstName;
let lastName=newMostRecent[i].lastName;
let candidateName=title+" "+firstName+" "+lastName;
let salaryRange=newMostRecent[i].salaryRange;
let category=newMostRecent[i].jobCategory;
let speciality=newMostRecent[i].speciality;
let country=newMostRecent[i].nationality;
let availability=newMostRecent[i].availability
finalMostRecent[i].name=candidateName+"-"+salaryRange;
finalMostRecent[i].jobCategory=category;
finalMostRecent[i].information=category+" "+availability+" "+country+" "+speciality;
finalMostRecent[i].updatedAt=newMostRecent.updatedAt;
}
}
    if(finalBestMatches.length>0){
    recommendedCandidates.bestMatches=finalBestMatches;
    }
    if(finalMostRecent.length>0){
    recommendedCandidates.mostRecent=finalMostRecent;
    }
    if(finalSavedCandidates.length>0){
    recommendedCandidates.savedCandidates=finalSavedCandidates;
    }

    let homePageOfClient=new Object();
    homePageOfClient.header=header;
    homePageOfClient.section=section;
    homePageOfClient.recommendedCandidates=recommendedCandidates;

    return homePageOfClient;
 }
 let bestMatches1=[]
 let mostRecent1=[];
 let savedCandidates1=[];
 if(bestMatches.length>0){
  for(let i=0;i<bestMatches.length;i++)
  {
    bestMatches1[i]=new Object();
  let title=bestMatches[i].title;
  let firstName=bestMatches[i].firstName;
  let lastName=bestMatches[i].lastName;
  let candidateName=title+" "+firstName+" "+lastName;
  let salaryRange=bestMatches[i].salaryRange;
  let category=bestMatches[i].jobCategory;
  let speciality=bestMatches[i].speciality;
  let country=bestMatches[i].nationality;
  let availability=bestMatches[i].availability
  bestMatches1[i].name=candidateName+"-"+salaryRange;
  bestMatches1[i].jobCategory=category;
  bestMatches1[i].information=category+" "+availability+" "+country+" "+speciality;
  bestMatches1[i].updatedAt=bestMatches[i].updatedAt;
 }
  }

  if(savedCandidates.length>0){
    for(let i=0;i<savedCandidates.length;i++)
    {
      savedCandidates1[i]=new Object();
    let title=savedCandidates[i].title;
    let firstName=savedCandidates[i].firstName;
    let lastName=savedCandidates[i].lastName;
    let candidateName=title+" "+firstName+" "+lastName;
    let salaryRange=savedCandidates[i].salaryRange;
    let category=savedCandidates[i].jobCategory;
    let speciality=savedCandidates[i].speciality;
    let country=savedCandidates[i].nationality;
    let availability=savedCandidates[i].availability
    savedCandidates1[i].name=candidateName+"-"+salaryRange;
    savedCandidates1[i].jobCategory=category;
    savedCandidates1[i].information=category+" "+availability+" "+country+" "+speciality;
    savedCandidates1[i].updatedAt=savedCandidates[i].updatedAt;
   }
    }
   

    if(mostRecent.length>0){
      for(let i=0;i<mostRecent.length;i++)
      {
      mostRecent1[i]=new Object();
      let title=mostRecent[i].title;
      let firstName=mostRecent[i].firstName;
      let lastName=mostRecent[i].lastName;
      let candidateName=title+" "+firstName+" "+lastName;
      let salaryRange=mostRecent[i].salaryRange;
      let category=mostRecent[i].jobCategory;
      let speciality=mostRecent[i].speciality;
      let country=mostRecent[i].nationality;
      let availability=mostRecent[i].availability
      mostRecent1[i].name=candidateName+"-"+salaryRange;
      mostRecent1[i].jobCategory=category;
      mostRecent1[i].information=category+" "+availability+" "+country+" "+speciality;
      mostRecent1[i].updatedAt=mostRecent[i].updatedAt;
     }
      }
  if(bestMatches1.length>0){
 recommendedCandidates.bestMatches=bestMatches1;
  }
  if(mostRecent1.length>0){
 recommendedCandidates.mostRecent=mostRecent1;
  }
  if(savedCandidates1.length>0){
 recommendedCandidates.savedCandidates=savedCandidates1;
  }
 let homePageOfClient=new Object();
 homePageOfClient.header=header;
 homePageOfClient.section=section;
 homePageOfClient.recommendedCandidates=recommendedCandidates;

 return homePageOfClient;
 
 
 }


 const matchedClientsForCandidateHomePage=async function(user,...searchParameters){
  

  if(user.role!="candidate") throw new ApiError(httpStatus.UNAUTHORIZED, 'user is not a candidate');

  let userId=user._id;

 
  if(user.isPrefrenceSet===false) throw new ApiError(httpStatus.BAD_REQUEST, "Preference is not set for this candidate");
 
  let candidatePreferenceData= await Perefrence.findOne({userId:userId});
 
  if(!candidatePreferenceData) throw new ApiError(httpStatus.BAD_REQUEST,"candidate preference data is not available");

 
  let candidateDetails= await UserDetail.findOne({userId:userId});
 
  if(!candidateDetails) throw new ApiError(httpStatus.BAD_REQUEST,"candidate detail is not available")


  let speciality=candidatePreferenceData.speciality;
 let country=candidateDetails.nationality;;
 let availability=candidatePreferenceData.availability;
 let firstName=candidateDetails.firstName;
 let jobType=candidatePreferenceData.jobType;
 let salaryType=candidatePreferenceData.salaryType;
 let salaryRange=candidatePreferenceData.salaryRange;
 let travelDistance=candidatePreferenceData.travelDistance;
 let jobCategory=candidatePreferenceData.jobCategory;
 let header=new Object();
 header.speciality=speciality;;
 header.country=country;
 header.availability=availability;
 let section=new Object();
   
 let date=new Date();
 let todayDay=date.getDay();
 let dayDate=date.getDate();
 let m=date.getMonth();
 let todayDate=date.getDate();
 const month={
 1:"January",
 2:"February",
 3:"March",
 4:"April",
 5:"May",
 6:"June",
 7:"July",
 8:"August",
 9:"September",
 10:"October",
 11:"November",
 12:"December"
 }
 
 const day={
 1:"Monday",
 2:"Tuesday",
 3:"Wednesday",
 4:"Thursday",
 5:"Friday",
 6:"Saturday",
 7:"Sunday"
 }
 
 for(let i in day)
 {
  if(todayDay==i)
  {
   i;
   dayDate=day[i];
  }
 }
 
 for(let i in month)
 {
  if(i==m){
  i++
  m=month[i];
  }
 }
 let today=dayDate+""+","+m+" "+todayDate+"th";
 section.today=today;
 section.information="Good Evening"+" "+firstName;
 
 let [descriptionRequired,categoryRequired,typeRequired,locationRequired,salaryRequired,nursingHomeRequired,bilisterPacksRequired,methadoneRequired,itemsPerDayRequired,weekHoursRequired,availableDaysRequired,specialityRequired,cityRequired
 ]=[...searchParameters];

 
 let commonData=await Perefrence.find({$or:[{speciality:{$eq:speciality}},{availability:{$eq:availability}},{jobType:{$eq:jobType}},{salaryType:{$eq:salaryType}},{salaryRange:{$eq:salaryRange}},{travelDistance:{$eq:travelDistance}},{jobCategory:{$eq:jobCategory}}]});
 
 let candidateAndClientPreferenceId=[];
   
  commonData.forEach(function(clientAndCandidate){
    candidateAndClientPreferenceId.push(clientAndCandidate.userId.toString())
  })
 

  let myClients=await User.find({$and:[{_id:{$in:candidateAndClientPreferenceId}},{role:{$eq:"client"}}]})
  

  let myClientsId=[];


  myClients.forEach(function(candidate){
   
   myClientsId.push(candidate._id.toString())
 
  })


  let userDetails=await UserDetail.find({userId:{$in:myClientsId}}).sort({updatedAt:1});
  
  let userDetailsId=[];

  userDetails.forEach(function(user){
   
  userDetailsId.push(user.userId);

  })

  
  let jobDetailsOfClients=await jobDetail.find({clientId:{$in:myClientsId}})
  
  let jobDetailsId=[];

  jobDetailsOfClients.forEach(function(clients){

   jobDetailsId.push(clients._id.toString());

  })
  
  let preferencesOfClients=await Perefrence.find({userId:{$in:myClientsId}}).sort({updatedAt:1});
  
  let preferencesId=[];

  preferencesOfClients.forEach(function(clients){
  
  preferencesId.push(clients.userId.toString());
     
  })
 

 let index=0;
 let bestMatches=[];
 bestMatches[index]=new Object();
 let mostRecent=[];
 mostRecent[index]=new Object();
 let recommendedClients=new Object();

 for(let i=0;i<jobDetailsOfClients.length;i++){
  
  let myJobDetails=await jobDetail.findOne({_id:{$eq:jobDetailsOfClients[i]}});
 
  if(myJobDetails!==null && myJobDetails!==undefined ){

  let myClientId=myJobDetails.clientId;

  if(myClientId!==null && myClientId!==undefined){
  
  
  let myClientDetails=await UserDetail.findOne({userId:myClientId})

  if(myClientDetails!==null && myClientDetails!==undefined){
  
  let myClientPreferences=await Perefrence.findOne({userId:myClientId})

  if(myClientPreferences!==null && myClientPreferences!==undefined){
       
        bestMatches[index].salaryType=myJobDetails.salaryType;
        bestMatches[index].description=myJobDetails.description;
        bestMatches[index].category=myJobDetails.category;
        bestMatches[index].type=myJobDetails.type;
        bestMatches[index].location=myJobDetails.location;
        bestMatches[index].salaryType=myJobDetails.salaryType;
        bestMatches[index].nursingHome=myJobDetails.nursingHome;
        bestMatches[index].bilisterPacks=myJobDetails.bilisterPacks;
        bestMatches[index].methadone=myJobDetails.methadone;;
        bestMatches[index].itemsPerDay=myJobDetails.itemsPerDay;
        bestMatches[index].salaryRange=myJobDetails.salaryRange;
        bestMatches[index].subject=myJobDetails.subject;
        bestMatches[index].updatedAt=myJobDetails.updatedAt;
        bestMatches[index].availability=myClientPreferences.availability;
        bestMatches[index].speciality=myClientPreferences.speciality;
        bestMatches[index].jobCategory=myClientPreferences.jobCategory;
        bestMatches[index].weekHours=myClientPreferences.weekHours;
        bestMatches[index].salaryType=myClientPreferences.salaryType
        bestMatches[index].salaryRange=myClientPreferences.salaryRange;
        bestMatches[index].availability=myClientPreferences.availability;
        bestMatches[index].experience=myClientPreferences.experience; 
  // let EstBudget=myJobDetails.salaryRange;

  // let speciality=myClientPreferences.speciality;

  // let salaryType=myJobDetails.salaryType;

  // let title=myJobDetails.title;

  // let location=myJobDetails.location;

  // bestMaches[index].subject=myJobDetails.subject;

  // bestMaches[index].description=myJobDetails.description;

  // bestMaches[index].type=salaryType+"-"+speciality+"-"+EstBudget;

  // bestMaches[index].information=title+" "+speciality+" "+location;

  // bestMaches[index].updatedAt=myJobDetails.updatedAt;
  // console.log(bestMaches[index]);
  index++;
  bestMatches[index]=new Object();

  }
  }
}
  }
  
 }


console.log(typeof descriptionRequired);
 let newBestMatches=[];
if(descriptionRequired!=undefined){
 
 if(descriptionRequired.length>0){

   bestMatches.filter(function(obj){
    descriptionRequired.filter(function(description){
      if(obj.description==description)
      newBestMatches.push(obj);
   })
  })
 }
}

if(categoryRequired!=undefined){
 
  if(categoryRequired.length>0){
 
    bestMatches.filter(function(obj){
     categoryRequired.filter(function(category){
       if(obj.category==category)
       newBestMatches.push(obj);
    })
   })
  }
 }


 if(typeRequired!=undefined){
 
  if(typeRequired.length>0){
 
    bestMatches.filter(function(obj){
     typeRequired.filter(function(type){
       if(obj.type==type)
       newBestMatches.push(obj);
    })
   })
  }
 }

 if(locationRequired!=undefined){
 
  if(locationRequired.length>0){
 
    bestMatches.filter(function(obj){
     locationRequired.filter(function(location){
       if(obj.location==location)
       newBestMatches.push(obj);
    })
   })
  }
 }
 
 if(salaryRequired!=undefined){
 
  if(salaryRequired.length>0){
 
    bestMatches.filter(function(obj){
     salaryRequired.filter(function(salary){
       if(obj.salary==salary)
       newBestMatches.push(obj);
    })
   })
  }
 }

 if(nursingHomeRequired!=undefined){
 
  if(nursingHomeRequired.length>0){
 
    bestMatches.filter(function(obj){
     nursingHomeRequired.filter(function(nursingHome){
       if(obj.nursingHome==nursingHome)
       newBestMatches.push(obj);
    })
   })
  }
 }

 if(bilisterPacksRequired!=undefined){
 
  if(bilisterPacksRequired.length>0){
 
    bestMatches.filter(function(obj){
     bilisterPacksRequired.filter(function(bilisterPacks){
       if(obj.bilisterPacks==bilisterPacks)
       newBestMatches.push(obj);
    })
   })
  }
 }

 if(methadoneRequired!=undefined){
 
  if(methadoneRequired.length>0){
 
    bestMatches.filter(function(obj){
     methadoneRequired.filter(function(methadone){
       if(obj.methadone==methadone)
       newBestMatches.push(obj);
    })
   })
  }
 }

 if(itemsPerDayRequired!=undefined){
 
  if(itemsPerDayRequired.length>0){
 
    bestMatches.filter(function(obj){
     itemsPerDayRequired.filter(function(itemsPerDayRequired){
       if(obj.itemsPerDayRequired==itemsPerDayRequired)
       newBestMatches.push(obj);
    })
   })
  }
 }
 
 if(weekHoursRequired!=undefined){
 
  if(weekHoursRequired.length>0){
 
    bestMatches.filter(function(obj){
     weekHoursRequired.filter(function(weekHours){
       if(obj.weekHours==weekHours)
       newBestMatches.push(obj);
    })
   })
  }
 }

 if(availableDaysRequired!=undefined){
 
  if(availableDaysRequired.length>0){
 
    bestMatches.filter(function(obj){
     availableDaysRequired.filter(function(availableDays){
       if(obj.availableDays==availableDays)
       newBestMatches.push(obj);
    })
   })
  }
 }

 if(specialityRequired!=undefined){
 
  if(specialityRequired.length>0){
 
    bestMatches.filter(function(obj){
     specialityRequired.filter(function(speciality){
       if(obj.speciality==speciality)
       newBestMatches.push(obj);
    })
   })
  }
 }

 if(cityRequired!=undefined){
 
  if(cityRequired.length>0){
 
    bestMatches.filter(function(obj){
     cityRequired.filter(function(city){
       if(obj.nationality==city)
       newBestMatches.push(obj);
    })
   })
  }
 }
 
 



let savedClientsId=[];
let count=0;
let savedClients=[];
savedClients[count]=new Object();
let savedClientsList=await favouriteJob.find({candidateId:userId});
 

 
 savedClientsList.forEach(function(candidate){
  
   savedClientsId.push(candidate.jobId.toString());
 
 })
 
 
 for(let i=0;i<savedClientsId.length;i++){
  
  let myJobDetails=await jobDetail.findOne({_id:{$eq:savedClientsId[i]}})

  if(myJobDetails!==null && myJobDetails!==undefined ){

  let myClientId=myJobDetails.clientId;

  if(myClientId!==null && myClientId!==undefined){
  
  
  let myClientDetails=await UserDetail.findOne({userId:myClientId})

  if(myClientDetails!==null && myClientDetails!==undefined){
  
  let myClientPreferences=await Perefrence.findOne({userId:myClientId})

  if(myClientPreferences!==null && myClientPreferences!==undefined){
    


    savedClients[count].salaryType=myJobDetails.salaryType;
    savedClients[count].description=myJobDetails.description;
    savedClients[count].category=myJobDetails.category;
    savedClients[count].type=myJobDetails.type;
    savedClients[count].location=myJobDetails.location;
    savedClients[count].salaryType=myJobDetails.salaryType;
    savedClients[count].nursingHome=myJobDetails.nursingHome;
    savedClients[count].bilisterPacks=myJobDetails.bilisterPacks;
    savedClients[count].methadone=myJobDetails.methadone;;
    savedClients[count].itemsPerDay=myJobDetails.itemsPerDay;
    savedClients[count].salaryRange=myJobDetails.salaryRange;
    savedClients[count].updatedAt=myJobDetails.updatedAt;
     bestMatches[count].subject=myJobDetails.subject;
    savedClients[count].availability=myClientPreferences.availability;
    savedClients[count].speciality=myClientPreferences.speciality;
    savedClients[count].jobCategory=myClientPreferences.jobCategory;
    savedClients[count].weekHours=myClientPreferences.weekHours;
    savedClients[count].salaryType=myClientPreferences.salaryType
    savedClients[count].salaryRange=myClientPreferences.salaryRange;
    savedClients[count].availability=myClientPreferences.availability;
    savedClients[count].experience=myClientPreferences.experience; 

  }
  }
}
  }
  
 }


 let newSavedClients=[];

 if(descriptionRequired!=undefined){
 
  if(descriptionRequired.length>0){
 
    savedClients.filter(function(obj){
     descriptionRequired.filter(function(description){
       if(obj.description==description)
       newSavedClients.push(obj);
    })
   })
  }
 }
 
 if(categoryRequired!=undefined){
  
   if(categoryRequired.length>0){
  
     savedClients.filter(function(obj){
      categoryRequired.filter(function(category){
        if(obj.category==category)
        newSavedClients.push(obj);
     })
    })
   }
  }
 
 
  if(typeRequired!=undefined){
  
   if(typeRequired.length>0){
  
     savedClients.filter(function(obj){
      typeRequired.filter(function(type){
        if(obj.type==type)
        newSavedClients.push(obj);
     })
    })
   }
  }
 
  if(locationRequired!=undefined){
  
   if(locationRequired.length>0){
  
     savedClients.filter(function(obj){
      locationRequired.filter(function(location){
        if(obj.location==location)
        newSavedClients.push(obj);
     })
    })
   }
  }
  
  if(salaryRequired!=undefined){
  
   if(salaryRequired.length>0){
  
     savedClients.filter(function(obj){
      salaryRequired.filter(function(salary){
        if(obj.salary==salary)
        newSavedClients.push(obj);
     })
    })
   }
  }
 
  if(nursingHomeRequired!=undefined){
  
   if(nursingHomeRequired.length>0){
  
     savedClients.filter(function(obj){
      nursingHomeRequired.filter(function(nursingHome){
        if(obj.nursingHome==nursingHome)
        newSavedClients.push(obj);
     })
    })
   }
  }
 
  if(bilisterPacksRequired!=undefined){
  
   if(bilisterPacksRequired.length>0){
  
     savedClients.filter(function(obj){
      bilisterPacksRequired.filter(function(bilisterPacks){
        if(obj.bilisterPacks==bilisterPacks)
        newSavedClients.push(obj);
     })
    })
   }
  }
 
  if(methadoneRequired!=undefined){
  
   if(methadoneRequired.length>0){
  
     savedClients.filter(function(obj){
      methadoneRequired.filter(function(methadone){
        if(obj.methadone==methadone)
        newSavedClients.push(obj);
     })
    })
   }
  }
 
  if(itemsPerDayRequired!=undefined){
  
   if(itemsPerDayRequired.length>0){
  
     savedClients.filter(function(obj){
      itemsPerDayRequired.filter(function(itemsPerDayRequired){
        if(obj.itemsPerDayRequired==itemsPerDayRequired)
        newSavedClients.push(obj);
     })
    })
   }
  }
  
  if(weekHoursRequired!=undefined){
  
   if(weekHoursRequired.length>0){
  
     savedClients.filter(function(obj){
      weekHoursRequired.filter(function(weekHours){
        if(obj.weekHours==weekHours)
        newSavedClients.push(obj);
     })
    })
   }
  }
 
  if(availableDaysRequired!=undefined){
  
   if(availableDaysRequired.length>0){
  
     savedClients.filter(function(obj){
      availableDaysRequired.filter(function(availableDays){
        if(obj.availableDays==availableDays)
        newSavedClients.push(obj);
     })
    })
   }
  }
 
  if(specialityRequired!=undefined){
  
   if(specialityRequired.length>0){
  
     savedClients.filter(function(obj){
      specialityRequired.filter(function(speciality){
        if(obj.speciality==speciality)
        newSavedClients.push(obj);
     })
    })
   }
  }
 
  if(cityRequired!=undefined){
  
   if(cityRequired.length>0){
  
     savedClients.filter(function(obj){
      cityRequired.filter(function(city){
        if(obj.nationality==city)
        newSavedClients.push(obj);
     })
    })
   }
  } 
 

 mostRecent=bestMatches.sort(function(a,b){
 
  if(a.updatedAt<b.updatedAt) return 1;
  if(a.updatedAt>b.updatedAt) return -1;
  return 0;
 

 })

let newMostRecent=[];
 
if(descriptionRequired!=undefined){
 
  if(descriptionRequired.length>0){
 
    mostRecent.filter(function(obj){
     descriptionRequired.filter(function(description){
       if(obj.description==description)
       newMostRecent.push(obj);
    })
   })
  }
 }
 
 if(categoryRequired!=undefined){
  
   if(categoryRequired.length>0){
  
     mostRecent.filter(function(obj){
      categoryRequired.filter(function(category){
        if(obj.category==category)
        newMostRecent.push(obj);
     })
    })
   }
  }
 
 
  if(typeRequired!=undefined){
  
   if(typeRequired.length>0){
  
     mostRecent.filter(function(obj){
      typeRequired.filter(function(type){
        if(obj.type==type)
        newMostRecent.push(obj);
     })
    })
   }
  }
 
  if(locationRequired!=undefined){
  
   if(locationRequired.length>0){
  
     mostRecent.filter(function(obj){
      locationRequired.filter(function(location){
        if(obj.location==location)
        newMostRecent.push(obj);
     })
    })
   }
  }
  
  if(salaryRequired!=undefined){
  
   if(salaryRequired.length>0){
  
     mostRecent.filter(function(obj){
      salaryRequired.filter(function(salary){
        if(obj.salary==salary)
        newMostRecent.push(obj);
     })
    })
   }
  }
 
  if(nursingHomeRequired!=undefined){
  
   if(nursingHomeRequired.length>0){
  
     mostRecent.filter(function(obj){
      nursingHomeRequired.filter(function(nursingHome){
        if(obj.nursingHome==nursingHome)
        newMostRecent.push(obj);
     })
    })
   }
  }
 
  if(bilisterPacksRequired!=undefined){
  
   if(bilisterPacksRequired.length>0){
  
     mostRecent.filter(function(obj){
      bilisterPacksRequired.filter(function(bilisterPacks){
        if(obj.bilisterPacks==bilisterPacks)
        newMostRecent.push(obj);
     })
    })
   }
  }
 
  if(methadoneRequired!=undefined){
  
   if(methadoneRequired.length>0){
  
     mostRecent.filter(function(obj){
      methadoneRequired.filter(function(methadone){
        if(obj.methadone==methadone)
        newMostRecent.push(obj);
     })
    })
   }
  }
 
  if(itemsPerDayRequired!=undefined){
  
   if(itemsPerDayRequired.length>0){
  
     mostRecent.filter(function(obj){
      itemsPerDayRequired.filter(function(itemsPerDayRequired){
        if(obj.itemsPerDayRequired==itemsPerDayRequired)
        newMostRecent.push(obj);
     })
    })
   }
  }
  
  if(weekHoursRequired!=undefined){
  
   if(weekHoursRequired.length>0){
  
     mostRecent.filter(function(obj){
      weekHoursRequired.filter(function(weekHours){
        if(obj.weekHours==weekHours)
        newMostRecent.push(obj);
     })
    })
   }
  }
 
  if(availableDaysRequired!=undefined){
  
   if(availableDaysRequired.length>0){
  
     mostRecent.filter(function(obj){
      availableDaysRequired.filter(function(availableDays){
        if(obj.availableDays==availableDays)
        newMostRecent.push(obj);
     })
    })
   }
  }
 
  if(specialityRequired!=undefined){
  
   if(specialityRequired.length>0){
  
     mostRecent.filter(function(obj){
      specialityRequired.filter(function(speciality){
        if(obj.speciality==speciality)
        newMostRecent.push(obj);
     })
    })
   }
  }
 
  if(cityRequired!=undefined){
  
   if(cityRequired.length>0){
  
     mostRecent.filter(function(obj){
      cityRequired.filter(function(city){
        if(obj.nationality==city)
        newMostRecent.push(obj);
     })
    })
   }
  } 

 for(let i=0;i<bestMatches.length;i++)
 {
  delete bestMatches[i].updatedAt;

 }
//  bestMaches.length=bestMaches.length-1;
//  mostRecent.length=mostRecent.length-1;
//  savedClients.length=savedClients.length-1;
//  bestMaches.splice(0,10);
//  mostRecent.splice(0,10);

 recommendedClients.intro="Browse jobs that match your experience and selected preferences. Ordered by most relevant";


 let x=0;
 if(searchParameters){
 for(let i=0;i<searchParameters.length;i++){
  if(searchParameters[i]){
  for(let j=0;j<searchParameters[i].length;j++){
    if(searchParameters[i][j]!==undefined || searchParameters[i][j]!==null)
      x++;
  }
  
 }
}
}

 let finalBestMatches=[];
 let finalSavedClients=[];
 let finalMostRecent=[];

 if(x>0)
 {
  if(newBestMatches.length>0){
  for(let i=0;i<newBestMatches.length;i++)
  {

  // if(Object.keys(newBestMatches[i]).length >0)
  // {
  finalBestMatches[i]=new Object();
  let myEstBudget=newBestMatches[i].salaryRange;
  let mySpeciality=newBestMatches[i].speciality;
  let mySalary=newBestMatches[i].salary;
  let myTitle=newBestMatches[i].title;
  let mySubject=newBestMatches[i].subject;
  let myLocation=newBestMatches[i].location;
  let myDescription=newBestMatches[i].description;
  
  finalBestMatches[i].subject=mySubject;
  finalBestMatches[i].description=myDescription;

  finalBestMatches[i].type=mySalary+"-"+mySpeciality+"-"+myEstBudget;

  finalBestMatches[i].information=myTitle+" "+mySpeciality+" "+myLocation;

  finalBestMatches[i].updatedAt=newBestMatches[i].updatedAt;
  

  // }
 }
  }

  if(newSavedClients.length>0){
 for(let i=0;i<newSavedClients.length;i++)
 {
  finalSavedClients[i]=new Object();
  let myEstBudget=newSavedClients[i].salaryRange;
  let mySpeciality=newSavedClients[i].speciality;
  let mySalary=newSavedClients[i].salary;
  let myTitle=newSavedClients[i].title;
  let mySubject=newSavedClients[i].subject;
  let myLocation=newSavedClients[i].location;
  let myDescription=newSavedClients[i].description;
  
  finalSavedClients[i].subject=mySubject;
  finalSavedClients[i].description=myDescription;

  finalSavedClients[i].type=mySalary+"-"+mySpeciality+"-"+myEstBudget;

  finalSavedClients[i].information=myTitle+" "+mySpeciality+" "+myLocation;

  finalSavedClients[i].updatedAt=newSavedClients[i].updatedAt;

  finalSavedClients[i]=new Object();
}
 }
if(newMostRecent.length>0){
for(let i=0;i<newMostRecent.length;i++)
{
  finalMostRecent[i]=new Object();
  let myEstBudget=newMostRecent[i].salaryRange;
  let mySpeciality=newMostRecent[i].speciality;
  let mySalary=newMostRecent[i].salary;
  let myTitle=newMostRecent[i].title;
  let mySubject=newMostRecent[i].subject;
  let myLocation=newMostRecent[i].location;
  let myDescription=newMostRecent[i].description;
  
  finalMostRecent[i].subject=mySubject;
  finalMostRecent[i].description=myDescription;

  finalMostRecent[i].type=mySalary+"-"+mySpeciality+"-"+myEstBudget;

  finalMostRecent[i].information=myTitle+" "+mySpeciality+" "+myLocation;

  finalMostRecent[i].updatedAt=newMostRecent[i].updatedAt;

}
}
    if(finalBestMatches.length>0){
    recommendedClients.bestMatches=finalBestMatches;
    }
    if(finalMostRecent.length>0){
    recommendedClients.mostRecent=finalMostRecent;
    }
    if(finalSavedClients.length>0){
    recommendedClients.savedClients=finalSavedClients;
    }

    let homePageOfCandidate=new Object();
    homePageOfCandidate.header=header;
    homePageOfCandidate.section=section;
    homePageOfCandidate.recommendedClients=recommendedClients;


    return homePageOfCandidate;
 }
 let bestMatches1=[]
 let mostRecent1=[];
 let savedClients1=[];
 if(bestMatches.length>0){
  for(let i=0;i<bestMatches.length;i++)
  {
    bestMatches1[i]=new Object();
    let myEstBudget=bestMatches[i].salaryRange;
    let mySpeciality=bestMatches[i].speciality;
    let mySalary=bestMatches[i].salary;
    let myTitle=bestMatches[i].title;
    let mySubject=bestMatches[i].subject;
    let myLocation=bestMatches[i].location;
    let myDescription=bestMatches[i].description;
    
    bestMatches1[i].subject=mySubject;
    bestMatches1[i].description=myDescription;
  
    bestMatches1[i].type=mySalary+"-"+mySpeciality+"-"+myEstBudget;
  
    bestMatches1[i].information=myTitle+" "+mySpeciality+" "+myLocation;
  
    bestMatches1[i].updatedAt=bestMatches[i].updatedAt;
 }
  }

  if(savedClients.length>0){
    for(let i=0;i<savedClients.length;i++)
    {
      savedClients1[i]=new Object();
      let myEstBudget=savedClients[i].salaryRange;
      let mySpeciality=savedClients[i].speciality;
      let mySalary=savedClients[i].salary;
      let myTitle=savedClients[i].title;
      let mySubject=savedClients[i].subject;
      let myLocation=savedClients[i].location;
      let myDescription=savedClients[i].description;
      
      savedClients1[i].subject=mySubject;
      savedClients1[i].description=myDescription;
    
      savedClients1[i].type=mySalary+"-"+mySpeciality+"-"+myEstBudget;
    
      savedClients1[i].information=myTitle+" "+mySpeciality+" "+myLocation;
    
      savedClients1[i].updatedAt=savedClients[i].updatedAt;
   }
    }
   

    if(mostRecent.length>0){
      for(let i=0;i<mostRecent.length;i++)
      {
        mostRecent1[i]=new Object();
        let myEstBudget=mostRecent[i].salaryRange;
        let mySpeciality=mostRecent[i].speciality;
        let mySalary=mostRecent[i].salary;
        let myTitle=mostRecent[i].title;
        let mySubject=mostRecent[i].subject;
        let myLocation=mostRecent[i].location;
        let myDescription=mostRecent[i].description;
        
        mostRecent1[i].subject=mySubject;
        mostRecent1[i].description=myDescription;
      
        mostRecent1[i].type=mySalary+"-"+mySpeciality+"-"+myEstBudget;
      
        mostRecent1[i].information=myTitle+" "+mySpeciality+" "+myLocation;
      
        mostRecent1[i].updatedAt=mostRecent[i].updatedAt;
     }
      }
  if(bestMatches1.length>0){
 recommendedClients.bestMatches=bestMatches1;
  }
  if(mostRecent1.length>0){
 recommendedClients.mostRecent=mostRecent1;
  }
  if(savedClients1.length>0){
 recommendedClients.savedClients=savedClients1;
  }
 let homePageOfClient=new Object();
 homePageOfClient.header=header;
 homePageOfClient.section=section;
 homePageOfClient.recommendedClients=recommendedClients;

 return homePageOfClient;


 }

 const getSpecificJobDetails=async function(oid){

  let jobDetail1=await jobDetail.findById({_id:oid});
  
  if(!jobDetail) throw new ApiError(httpStatus.NOT_FOUND, 'job details are not available');
  
  return jobDetail1;
 }

 const getSpecificCandidateDetails=async function(oid){ 

  let candidateDetail=await UserDetail.findOne({userId:oid})
  if(!candidateDetail) throw new ApiError(httpStatus.NOT_FOUND, 'candidate details are not available');
   return candidateDetail;
  }

module.exports = {
  createUser,
  queryUsers,
  getUserById,
  getUserByEmail,
  updateUserById,
  deleteUserById,
  matchedCandidatesForClientHomePage,
  clientHomePage,
  candidateHomePage,
  matchedClientsForCandidateHomePage,
  getSpecificJobDetails,
  getSpecificCandidateDetails,
};
