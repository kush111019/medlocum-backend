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

  
 
  if(user.role!="candidate") throw new ApiError(httpStatus.NOT_FOUND, 'user is not a candidate');

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
 clientsList.forEach(function(candidate){
 clientsId.push(candidate._id.toString())
})

let jobDetails=await jobDetail.find({clientId:userId});

let jobDetailsId=[];

jobDetails.forEach(function(job){

 jobDetailsId.push(job._id);

})


let index=0;
let clients=[];
clients[index]=new Object();


for(let i=0;i<jobDetailsId.length;i++){

     let jobId=jobDetailsId[i];

     if(jobId!==null && jobId!==undefined){

     let jobDetails=await jobDetail.findOne({_id:jobId}).select({description:1,salaryRange:1,clientId:1,title:1,location:1,subject:1});

     if(jobDetails!==null && jobDetails!==undefined){

      let clientId=jobDetails.clientId;

      if(clientId!==null && clientId!==undefined){
      
      let basicDetails=await UserDetail.findOne({userId:clientId})
      
      if(basicDetails!==null && basicDetails!==undefined){

      let myClientPreferences=await Perefrence.findOne({userId:clientId}).select({speciality:1});

      if(myClientPreferences!==null && myClientPreferences!==undefined){
 
    
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

 bestMatches.length=bestMatches.length-1;
 mostRecent.length=mostRecent.length-1;
 savedClients.length=savedClients.length-1;
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

  if(user.role!="client") throw new ApiError(httpStatus.NOT_FOUND, 'user is not a client');

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
 bestMatches.length=bestMatches.length-1;
 mostRecent.length=mostRecent.length-1;
 savedCandidate.length=savedCandidate.length-1;
 bestMatches.splice(0,10);
 mostRecent.splice(0,10);
 

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


const matchedCandidatesForClientHomePage = async function(user){

  if(user.role!="client") throw new ApiError(httpStatus.NOT_FOUND, 'user is not a client');

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

      let candidateBasicDetails = await UserDetail.findOne({userId:userId}).select({firstName:1,lastName:1,nationality:1,userId:1,updatedAt:1}).sort({updatedAt:1})

      if(candidateBasicDetails!==null && candidateBasicDetails!==undefined){

      let candidatePreferenceDetails=await Perefrence.findOne({userId:userId}).select({_id:0,jobCategory:1,speciality:1,availability:1,salaryRange:1}).sort({updatedAt:1});
       
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
      bestMatches[index].name=candidateName+"-"+salaryRange;
      bestMatches[index].jobCategory=category;
      bestMatches[index].information=category+" "+availability+" "+country+" "+speciality;
      bestMatches[index].updatedAt=candidateBasicDetails.updatedAt;
      index++;
      bestMatches[index]=new Object();
      }
      }
 
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
  
  let candidateBasicDetails = await UserDetail.findOne({userId:userId}).select({firstName:1,lastName:1,nationality:1,userId:1})
  
  if(candidateBasicDetails!==null && candidateBasicDetails!==undefined){

  let candidatePreferenceDetails=await Perefrence.findOne({userId:userId}).select({_id:0,jobCategory:1,speciality:1,availability:1,salaryRange:1})
  
  if(candidatePreferenceDetails!==null && candidatePreferenceDetails!==undefined){
  console.log(candidatePreferenceDetails);
  let title=candidateBasicDetails.title;
  let firstName=candidateBasicDetails.firstName;
  let lastName=candidateBasicDetails.lastName;
  let candidateName=title+" "+firstName+" "+lastName;
  let salaryRange=candidatePreferenceDetails.salaryRange;
  console.log(salaryRange);
  let category=candidatePreferenceDetails.jobCategory;
  let speciality=candidatePreferenceDetails.speciality;
  let country=candidateBasicDetails.nationality;
  let availability=candidatePreferenceDetails.availability
  savedCandidates[count].name=candidateName+"-"+salaryRange;
  savedCandidates[count].jobCategory=category;
  savedCandidates[count].information=category+" "+availability+" "+country+" "+speciality;

  count++;
  savedCandidates[count]=new Object();
  
  }
  }
  }

  }  
 //------------------loop ends here-----------------------------


 mostRecent=bestMatches.sort(function(a,b){
 
  if(a.updatedAt<b.updatedAt) return 1;
  if(a.updatedAt>b.updatedAt) return -1;
  return 0;
 

 })

 for(let i=0;i<bestMatches.length;i++)
 {
  delete bestMatches[i].updatedAt;

 }
 bestMatches.length=bestMatches.length-1;
 mostRecent.length=mostRecent.length-1;
 savedCandidates.length=savedCandidates.length-1;
 bestMatches.splice(0,10);
 mostRecent.splice(0,10);

 recommendedCandidates.intro="Browse candidates that match your requirements and job preferences.Ordered by most relevant";
 
 
 recommendedCandidates.bestMatches=bestMatches;
 recommendedCandidates.mostRecent=mostRecent;
 recommendedCandidates.savedCandidates=savedCandidates;

 let homePageOfClient=new Object();
 homePageOfClient.header=header;
 homePageOfClient.section=section;
 homePageOfClient.recommendedCandidates=recommendedCandidates;

 return homePageOfClient;
 
 
 }


 const matchedClientsForCandidateHomePage=async function(user){
  

  if(user.role!="candidate") throw new ApiError(httpStatus.NOT_FOUND, 'user is not a candidate');

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
 let bestMaches=[];
 bestMaches[index]=new Object();
 let mostRecent=[];
 mostRecent[index]=new Object();
 let recommendedClients=new Object();

 for(let i=0;i<jobDetailsOfClients.length;i++){
  
  let myJobDetails=await jobDetail.findOne({_id:{$eq:jobDetailsOfClients[i]}}).select({_id:1,subject:1,description:1,salaryType:1,location:1,salaryRange:1,clientId:1,title:1,updatedAt:1})
 
  if(myJobDetails!==null && myJobDetails!==undefined ){

  let myClientId=myJobDetails.clientId;

  if(myClientId!==null && myClientId!==undefined){
  
  
  let myClientDetails=await UserDetail.findOne({userId:myClientId}).select({title:1,firstName:1,lastName:1,nationality:1,updatedAt:1})

  if(myClientDetails!==null && myClientDetails!==undefined){
  
  let myClientPreferences=await Perefrence.findOne({userId:myClientId}).select({jobCategory:1,availability:1,salaryType:1,Speciality:1,updatedAt:1});

  if(myClientPreferences!==null && myClientPreferences!==undefined){
    
  let EstBudget=myJobDetails.salaryRange;

  let speciality=myClientPreferences.speciality;

  let salaryType=myJobDetails.salaryType;

  let title=myJobDetails.title;

  let location=myJobDetails.location;

  bestMaches[index].subject=myJobDetails.subject;

  bestMaches[index].description=myJobDetails.description;

  bestMaches[index].type=salaryType+"-"+speciality+"-"+EstBudget;

  bestMaches[index].information=title+" "+speciality+" "+location;

  bestMaches[index].updatedAt=myJobDetails.updatedAt;

  index++;
  bestMaches[index]=new Object();

  }
  }
}
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
  
  let myJobDetails=await jobDetail.findOne({_id:{$eq:savedClientsId[i]}}).select({_id:1,subject:1,description:1,salaryType:1,location:1,salaryRange:1,clientId:1,title:1,updatedAt:1});

  if(myJobDetails!==null && myJobDetails!==undefined ){

  let myClientId=myJobDetails.clientId;

  if(myClientId!==null && myClientId!==undefined){
  
  
  let myClientDetails=await UserDetail.findOne({userId:myClientId}).select({title:1,firstName:1,lastName:1,nationality:1})

  if(myClientDetails!==null && myClientDetails!==undefined){
  
  let myClientPreferences=await Perefrence.findOne({userId:myClientId}).select({jobCategory:1,availability:1,salaryType:1,speciality:1});

  if(myClientPreferences!==null && myClientPreferences!==undefined){
    
    let EstBudget=myJobDetails.salaryRange;
    let speciality=myClientPreferences.speciality;
    let salaryType=myJobDetails.salaryType;
    let title=myJobDetails.title;
    let location=myJobDetails.location;
  
    savedClients[count].subject=myJobDetails.subject;
    savedClients[count].description=myJobDetails.description;
    savedClients[count].type=salaryType+"-"+speciality+"-"+EstBudget;
    savedClients[count].information=title+" "+speciality+" "+location;
    count++;
    savedClients[count]=new Object();

  }
  }
}
  }
  
 }

 mostRecent=bestMaches.sort(function(a,b){
 
  if(a.updatedAt<b.updatedAt) return 1;
  if(a.updatedAt>b.updatedAt) return -1;
  return 0;
 

 })

 for(let i=0;i<bestMaches.length;i++)
 {
  delete bestMaches[i].updatedAt;

 }
 bestMaches.length=bestMaches.length-1;
 mostRecent.length=mostRecent.length-1;
 savedClients.length=savedClients.length-1;
 bestMaches.splice(0,10);
 mostRecent.splice(0,10);
 recommendedClients.intro="Browse jobs that match your experience and selected preferences. Ordered by most relevant";
 recommendedClients.bestMaches=bestMaches;
 recommendedClients.mostRecent=mostRecent;
 recommendedClients.savedClients=savedClients;
 let homePageOfCandidate=new Object();
 homePageOfCandidate.header=header;
 homePageOfCandidate.section=section;
 homePageOfCandidate.recommendedClients=recommendedClients;
 return homePageOfCandidate;


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
  matchedClientsForCandidateHomePage
};
