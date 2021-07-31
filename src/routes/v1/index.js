const express = require('express');

// Production routes
const authRoute = require('./auth.route');
const userRoute = require('./user.route');
const shopTypeRoute = require('./shoptype.route');
const shopRoute = require('./shop.route');
const accountRoute = require('./account.route');
const lineItemCategoryRoute = require('./lineitemcategory.route');
// Dev routes
const docsRoute = require('./docs.route');

const config = require('../../config/config');

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
    path: '/shoptype',
    route: shopTypeRoute,
  },
  {
    path: '/shop',
    route: shopRoute,
  },
  {
    path: '/account',
    route: accountRoute,
  },
  {
    path: '/lineitemcategory',
    route: lineItemCategoryRoute,
  },
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
