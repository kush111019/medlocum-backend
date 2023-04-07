const express = require('express');
const router = express.Router();
const favouriteJobController = require('../../../controllers/v1/webApp/favouriteJob.controller');

const validate = require('../../../middlewares/validate');
const favouriteJobValidation = require('../../../validations/v1/webApp/favouriteJob.validation');
const auth = require('../../../middlewares/auth');


router.post('/',auth(),validate(favouriteJobValidation.createFavouriteJob),favouriteJobController.createFavouriteJob);


router.delete('/',auth(),validate(favouriteJobValidation.deleteFavouriteJob),favouriteJobController.deleteFavouriteJob);







module.exports=router;