const express = require('express');
const authRoute = require('./auth.route');
const userRoute = require('./user.route');
const docsRoute = require('./docs.route');
const config = require('../../../config/config');
const homeRoute=require('./home.route');
const jobDetailsRoute=require('./jobDetails.route');
const jobRequestRoute=require('./jobRequest.route');
const favouriteJobRoute=require('./favouriteJob.route');
const favouriteCandidateRoute=require('./favouriteCandidate.route');
const specificUserRoute=require('./specificUser.route');
const jobRoute = require('./job.route');

const router = express.Router();

const defaultRoutes = [
  {
    path: '/auth',
    route: authRoute,
  },
  {
    path: '/users',
    route: userRoute,
  },
  {
    path:'/home',
    route:homeRoute,

  },

  {
    path: '/jobs',
    route: jobRoute,
  },
  {
    path: '/jobDetails',
    route: jobDetailsRoute,
  },
  {
    path:'/jobRequest',
    route: jobRequestRoute,
  },
  {
    path:'/favouriteCandidate',
    route:favouriteCandidateRoute,
  },
  {
    path:'/favouriteJob',
    route:favouriteJobRoute,
  },

  {
    path:'/specificUser',
    route:specificUserRoute,
  }
];

const devRoutes = [
  // routes available only in development mode
  {
    path: '/docs',
    route: docsRoute,
  },
];

defaultRoutes.forEach((route) => {
  router.use(route.path, route.route);
});

/* istanbul ignore next */
if (config.env === 'development') {
  devRoutes.forEach((route) => {
    router.use(route.path, route.route);
  });
}

module.exports = router;
