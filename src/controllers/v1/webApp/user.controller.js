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

  res.sendJSONResponse({
    code: httpStatus.OK,
    status: true,
    message: utility.getWebAppMessages('homePage.CandidateRecommendedJobSuccess'),
    data: {results:data1}
  })

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

 let data1=await userService.matchedCandidatesForClientHomePage(user);
  res.status(200).send({status:true,message:data1})
//  res.sendJSONResponse({
  
//   code:httpStatus.OK,
//   status: true,
//   message: utility.getWebAppMessages('jobMessage.ClientRecommendedCandidateSuccess'),
//   data: {result:data1}

// })

})

const matchedClientsForCandidateHomePage=catchAsync(async(req,res)=>{

  let user=req.user;
 
  let data1=await userService.matchedClientsForCandidateHomePage(user);
  res.status(200).send({status:true,message:data1})
  res.sendJSONResponse({
   
   code:httpStatus.OK,
   status: true,
   message: utility.getWebAppMessages('jobMessage.ClientRecommendedCandidateSuccess'),
   data: {results:data1}
 
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
  matchedClientsForCandidateHomePage
}
