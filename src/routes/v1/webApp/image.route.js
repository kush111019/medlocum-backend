const express = require('express');
const router = express.Router();
const multer = require("multer");
const storage = multer.memoryStorage();
const upload = multer({ storage });


router.use(express.static("./uploads"));

const jobDetailsController =  require("../../../controllers/v1/webApp/jobDetails.controller")


router.post("/",upload.single("picture"),jobDetailsController.compressImage)


router.exports =  router;