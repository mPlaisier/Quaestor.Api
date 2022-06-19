const Joi = require('joi');
const { objectId } = require('./custom.validation');

const getGoals = {
  query: Joi.object().keys({
    name: Joi.string(),
    description: Joi.string(),
    amount: Joi.number().precision(2),
    account: Joi.string().custom(objectId),
    goalType: Joi.string().valid('AmountSaved', 'AmountReached'),
    sortBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
  }),
};

const createGoal = {
  body: Joi.object().keys({
    name: Joi.string().required(),
    description: Joi.string(),
    amount: Joi.number().precision(2).required(),
    account: Joi.string().custom(objectId).required(),
    goalType: Joi.string().valid('AmountSaved', 'AmountReached').required(),
  }),
};

const updateGoal = {
  params: Joi.object().keys({
    goalId: Joi.required().custom(objectId),
  }),
  body: Joi.object().keys({
    name: Joi.string(),
    description: Joi.string(),
    amount: Joi.number().precision(2),
    account: Joi.string().custom(objectId),
    goalType: Joi.string().valid('AmountSaved', 'AmountReached'),
  }),
};

const deleteGoal = {
  params: Joi.object().keys({
    goalId: Joi.string().custom(objectId).required(),
  }),
};

module.exports = {
  getGoals,
  createGoal,
  updateGoal,
  deleteGoal,
};
