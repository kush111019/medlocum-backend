const express = require('express');

const router = express.Router();

// const adminRoutes = require('./admin'); //Admin Panel
const webAppRoutes = require('./webApp');

// const commonRoutes = require('./common');

// router.use('/', commonRoutes);

// router.use('/admin', adminRoutes);

router.use('/web-app', webAppRoutes);

module.exports = router;
