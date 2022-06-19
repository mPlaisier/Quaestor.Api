const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { goalService } = require('../services');

const createGoal = catchAsync(async (req, res) => {
  const goal = await goalService.createGoal({ ...req.body, user: req.user });
  res.status(httpStatus.CREATED).send(goal);
});

const getGoals = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['name', 'description', 'amount', 'account', 'goalType']);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const result = await goalService.queryGoals({ ...filter, user: req.user }, options);
  res.send(result);
});

const getGoal = catchAsync(async (req, res, next) => {
  const goal = await goalService.getGoalById(req.params.goalId);
  if (!goal) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Goal not found');
  }
  if (!goal.user || goal.user.equals(req.user._id) === false) {
    throw new ApiError(httpStatus.FORBIDDEN, 'Forbidden');
  }

  res.goal = goal;
  next();
});

const updateGoal = catchAsync(async (req, res) => {
  const goal = await goalService.updateGoal(res.goal, req.body);
  res.send(goal);
});

const deleteGoal = catchAsync(async (_req, res) => {
  await goalService.deleteGoal(res.goal);
  res.status(httpStatus.NO_CONTENT).send();
});

module.exports = {
  createGoal,
  getGoals,
  getGoal,
  updateGoal,
  deleteGoal,
};
