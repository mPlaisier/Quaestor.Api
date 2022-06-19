const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { balanceService } = require('../services');

const createBalance = catchAsync(async (req, res) => {
  const balance = await balanceService.createBalance({ ...req.body, user: req.user });
  res.status(httpStatus.CREATED).send(balance);
});

const getBalances = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['month', 'year', 'account']);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const result = await balanceService.queryBalances({ ...filter, user: req.user }, options);
  res.send(result);
});

const getBalance = catchAsync(async (req, res, next) => {
  const balance = await balanceService.getBalanceById(req.params.balanceId);
  if (!balance) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Balance not found');
  }
  if (!balance.user || balance.user.equals(req.user._id) === false) {
    throw new ApiError(httpStatus.FORBIDDEN, 'Forbidden');
  }

  res.balance = balance;
  next();
});

const updateBalance = catchAsync(async (req, res) => {
  const balance = await balanceService.updateBalance(res.balance, req.body);
  res.send(balance);
});

const deleteBalance = catchAsync(async (_req, res) => {
  await balanceService.deleteBalance(res.balance);
  res.status(httpStatus.NO_CONTENT).send();
});

module.exports = {
  createBalance,
  getBalances,
  getBalance,
  updateBalance,
  deleteBalance,
};
