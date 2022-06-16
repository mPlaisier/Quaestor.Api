const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { lineContainerService } = require('../services');

const createLineContainer = catchAsync(async (req, res) => {
  const lineContainer = await lineContainerService.createLineContainer({ ...req.body, user: req.user });
  res.status(httpStatus.CREATED).send(lineContainer);
});

const getLineContainers = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['month', 'year', 'date', 'shop', 'account']);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const result = await lineContainerService.queryLineContainers({ ...filter, user: req.user }, options);
  res.send(result);
});

const getLineContainer = catchAsync(async (req, res, next) => {
  const lineContainer = await lineContainerService.getLineContainerById(req.params.lineContainerId);
  if (!lineContainer) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Line container not found');
  }
  if (!lineContainer.user || lineContainer.user.equals(req.user._id) === false) {
    throw new ApiError(httpStatus.FORBIDDEN, 'Forbidden');
  }

  res.lineContainer = lineContainer;
  next();
});

const updateLineContainer = catchAsync(async (req, res) => {
  const lineContainer = await lineContainerService.updateLineContainer(res.lineContainer, req.body);
  res.send(lineContainer);
});

const deleteLineContainer = catchAsync(async (_req, res) => {
  await lineContainerService.deleteLineContainer(res.lineContainer);
  res.status(httpStatus.NO_CONTENT).send();
});

module.exports = {
  createLineContainer,
  getLineContainers,
  getLineContainer,
  updateLineContainer,
  deleteLineContainer,
};
