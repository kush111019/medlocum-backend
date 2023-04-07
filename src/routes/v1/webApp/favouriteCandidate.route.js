const express = require('express');
const router = express.Router();
const validate = require('../../../middlewares/validate');
const auth = require('../../../middlewares/auth');
const favouriteCandidateController = require('../../../controllers/v1/webApp/favouriteCandidate.controller');
const favouriteCandidateValidation = require('../../../validations/v1/webApp/favouriteCandidate.validation');


router.post('/',auth(),validate(favouriteCandidateValidation.createFavouriteCandidate),favouriteCandidateController.createFavouriteCandidate);

router.delete('/',auth(),validate(favouriteCandidateValidation.deleteFavouriteCandidate),favouriteCandidateController.deleteFavouriteCandidate);







module.exports=router;