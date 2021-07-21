const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { accountService } = require('../services');
const logger = require('../config/logger');

const createAccount = catchAsync(async (req, res) => {
  const account = await accountService.createAccount({ ...req.body, user: req.user });
  res.status(httpStatus.CREATED).send(account);
});

const getAccounts = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['name', 'accountType', 'isDefault']);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const result = await accountService.queryAccounts({ ...filter, user: req.user }, options);
  res.send(result);
});

const getAccount = catchAsync(async (req, res, next) => {
  const result = await accountService.getAccountById(req.params.accountId);
  if (!result) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Account not found');
  }
  if (!result.user || result.user.equals(req.user._id) === false) {
    throw new ApiError(httpStatus.FORBIDDEN, 'Forbidden');
  }

  logger.info('Result:');
  logger.info(result);

  res.account = result;
  next();
});

const updateAccount = catchAsync(async (req, res) => {
  const account = await accountService.updateAccount(res.account, req.body);
  res.send(account);
});

const deleteAccount = catchAsync(async (req, res) => {
  await accountService.deleteAccount(res.account);
  res.status(httpStatus.NO_CONTENT).send();
});

module.exports = {
  createAccount,
  getAccounts,
  getAccount,
  updateAccount,
  deleteAccount,
};
