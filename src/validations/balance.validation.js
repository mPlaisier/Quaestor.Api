const Joi = require('joi');
const { objectId } = require('./custom.validation');

const getBalances = {
  query: Joi.object().keys({
    month: Joi.number().integer().min(1).max(12).required(),
    year: Joi.number().integer().min(2019).max(2100).required(),
    account: Joi.string().custom(objectId),
    sortBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
  }),
};

const createBalance = {
  body: Joi.object().keys({
    month: Joi.number().integer().min(1).max(12).required(),
    year: Joi.number().integer().min(2019).max(2100).required(),
    amount: Joi.number().precision(2).required(),
    account: Joi.string().custom(objectId).required(),
  }),
};

const updateBalance = {
  params: Joi.object().keys({
    balanceId: Joi.required().custom(objectId),
  }),
  body: Joi.object().keys({
    month: Joi.number().integer().min(1).max(12),
    year: Joi.number().integer().min(2019).max(2100),
    amount: Joi.number().precision(2),
    account: Joi.string().custom(objectId),
  }),
};

const deleteBalance = {
  params: Joi.object().keys({
    balanceId: Joi.string().custom(objectId).required(),
  }),
};

module.exports = {
  getBalances,
  createBalance,
  updateBalance,
  deleteBalance,
};
