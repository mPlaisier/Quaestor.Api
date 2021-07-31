const Joi = require('joi');
const { objectId } = require('./custom.validation');

const getLineItemCategories = {
  query: Joi.object().keys({
    sortBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
  }),
};

const createLineItemCategory = {
  body: Joi.object().keys({
    name: Joi.string().required(),
  }),
};

const updateLineItemCategory = {
  params: Joi.object().keys({
    lineItemCategoryId: Joi.required().custom(objectId),
  }),
  body: Joi.object().keys({
    name: Joi.string().required(),
  }),
};

const deleteLineItemCategory = {
  params: Joi.object().keys({
    lineItemCategoryId: Joi.string().custom(objectId),
  }),
};

module.exports = {
  getLineItemCategories,
  createLineItemCategory,
  updateLineItemCategory,
  deleteLineItemCategory,
};
