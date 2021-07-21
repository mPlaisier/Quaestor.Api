const Joi = require('joi');
const { objectId } = require('./custom.validation');

const createAccount = {
  body: Joi.object().keys({
    name: Joi.string().required(),
    accountType: Joi.string().required().valid('Bank', 'Mealvouchers', 'Cash', 'Savings', 'Investment'),
    isDefault: Joi.boolean(),
  }),
};

const getAccounts = {
  query: Joi.object().keys({
    name: Joi.string(),
    accountType: Joi.string().valid('Bank', 'Mealvouchers', 'Cash', 'Savings', 'Investment'),
    isDefault: Joi.boolean(),
    sortBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
  }),
};

const getAccount = {
  params: Joi.object().keys({
    accountId: Joi.string().custom(objectId),
  }),
};

const updateAccount = {
  params: Joi.object().keys({
    accountId: Joi.required().custom(objectId),
  }),
  body: Joi.object()
    .keys({
      name: Joi.string(),
      accountType: Joi.string().valid('Bank', 'Mealvouchers', 'Cash', 'Savings', 'Investment'),
      isDefault: Joi.boolean(),
    })
    .min(1),
};

const deleteAccount = {
  params: Joi.object().keys({
    accountId: Joi.string().custom(objectId),
  }),
};

module.exports = {
  createAccount,
  getAccounts,
  getAccount,
  updateAccount,
  deleteAccount,
};
