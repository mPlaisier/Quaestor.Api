const Joi = require('joi');
const { objectId } = require('./custom.validation');

const createLineContainer = {
  body: Joi.object().keys({
    date: Joi.date().required(),
    shop: Joi.string().custom(objectId).required(),
    totalAmount: Joi.number().precision(2).required(),
    month: Joi.number().integer().min(1).max(12).required(),
    year: Joi.number().integer().min(2019).max(2100).required(),
    lineItems: Joi.array().items(
      Joi.object()
        .keys({
          description: Joi.string(),
          lineCategory: Joi.string().custom(objectId),
          amount: Joi.number().precision(2).required(),
          account: Joi.string().custom(objectId).required(),
          paymentType: Joi.string().valid('Income', 'Expense', 'CashFlow'),
        })
        .min(1)
    ),
  }),
};

const getLineContainers = {
  query: Joi.object().keys({
    date: Joi.date(),
    shop: Joi.string().custom(objectId),
    account: Joi.string().custom(objectId),
    month: Joi.number().integer().min(1).max(12).required(),
    year: Joi.number().integer().min(2019).max(2100).required(),
    sortBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
  }),
};

const updateLineContainer = {
  params: Joi.object().keys({
    lineContainerId: Joi.required().custom(objectId),
  }),
  body: Joi.object().keys({
    date: Joi.date(),
    shop: Joi.string().custom(objectId),
    totalAmount: Joi.number().precision(2),
    month: Joi.number().integer().min(1).max(12),
    year: Joi.number().integer().min(2019).max(2100),
    lineItems: Joi.array().items(
      Joi.object().keys({
        description: Joi.string(),
        lineCategory: Joi.string().custom(objectId),
        amount: Joi.number().precision(2),
        account: Joi.string().custom(objectId),
        paymentType: Joi.string().valid('Income', 'Expense', 'CashFlow'),
      })
    ),
  }),
};

const deleteLineContainer = {
  params: Joi.object().keys({
    lineContainerId: Joi.string().custom(objectId).required(),
  }),
};

module.exports = {
  getLineContainers,
  createLineContainer,
  updateLineContainer,
  deleteLineContainer,
};
