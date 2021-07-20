const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { shopService } = require('../services');

const createShop = catchAsync(async (req, res) => {
  const shop = await shopService.createShop({ ...req.body, user: req.user });
  res.status(httpStatus.CREATED).send(shop);
});

const getShops = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['name', 'shopType']);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const result = await shopService.queryShops({ ...filter, user: req.user }, options);
  res.send(result);
});

const getShop = catchAsync(async (req, res, next) => {
  const shop = await shopService.getShopById(req.params.shopId);
  if (!shop) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Shop not found');
  }
  if (!shop.user || shop.user.equals(req.user._id) === false) {
    throw new ApiError(httpStatus.FORBIDDEN, 'Forbidden');
  }

  res.shop = shop;
  next();
});

const updateShop = catchAsync(async (req, res) => {
  const shop = await shopService.updateShop(res.shop, req.body);
  res.send(shop);
});

const deleteShop = catchAsync(async (_req, res) => {
  await shopService.deleteShop(res.shop);
  res.status(httpStatus.NO_CONTENT).send();
});

module.exports = {
  createShop,
  getShops,
  getShop,
  updateShop,
  deleteShop,
};
