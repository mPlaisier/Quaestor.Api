const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { shopTypeService } = require('../services');

const createShopType = catchAsync(async (req, res) => {
  const shopType = await shopTypeService.createShopType({ ...req.body, user: req.user });
  res.status(httpStatus.CREATED).send(shopType);
});

const getShopTypes = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['name']);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const result = await shopTypeService.queryShopTypes({ ...filter, user: req.user }, options);
  res.send(result);
});

const getShopType = catchAsync(async (req, res, next) => {
  const shopType = await shopTypeService.getShopTypeById(req.params.shopId);
  if (!shopType) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Shop type not found');
  }
  if (!shopType.user || shopType.user.equals(req.user._id) === false) {
    throw new ApiError(httpStatus.FORBIDDEN, 'Forbidden');
  }

  res.shopType = shopType;
  next();
});

const updateShopType = catchAsync(async (req, res) => {
  const shopType = await shopTypeService.updateShopType(res.shopType, req.body);
  res.send(shopType);
});

const deleteShopType = catchAsync(async (_req, res) => {
  await shopTypeService.deleteShopType(res.shopType);
  res.status(httpStatus.NO_CONTENT).send();
});

module.exports = {
  createShopType,
  getShopType,
  getShopTypes,
  updateShopType,
  deleteShopType,
};
