const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { lineItemCategoryService } = require('../services');

const createLineItemCategory = catchAsync(async (req, res) => {
  const lineItemCategory = await lineItemCategoryService.createLineItemCategory({ ...req.body, user: req.user });
  res.status(httpStatus.CREATED).send(lineItemCategory);
});

const getLineItemCategories = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['name']);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const result = await lineItemCategoryService.queryLineItemCategories({ ...filter, user: req.user }, options);
  res.send(result);
});

const getLineItemCategory = catchAsync(async (req, res, next) => {
  const lineItemCategory = await lineItemCategoryService.getLineItemCategoryById(req.params.lineItemCategoryId);
  if (!lineItemCategory) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Line-item category not found');
  }
  if (!lineItemCategory.user || lineItemCategory.user.equals(req.user._id) === false) {
    throw new ApiError(httpStatus.FORBIDDEN, 'Forbidden');
  }

  res.lineItemCategory = lineItemCategory;
  next();
});

const updateLineItemCategory = catchAsync(async (req, res) => {
  const lineItemCategory = await lineItemCategoryService.updateLineItemCategory(res.lineItemCategory, req.body);
  res.send(lineItemCategory);
});

const deleteLineItemCategory = catchAsync(async (_req, res) => {
  await lineItemCategoryService.deleteLineItemCategory(res.lineItemCategory);
  res.status(httpStatus.NO_CONTENT).send();
});

module.exports = {
  createLineItemCategory,
  getLineItemCategory,
  getLineItemCategories,
  updateLineItemCategory,
  deleteLineItemCategory,
};
