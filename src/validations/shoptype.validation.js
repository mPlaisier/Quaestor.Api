const Joi = require('joi');
const { objectId } = require('./custom.validation');

const getShopTypes = {
  query: Joi.object().keys({
    sortBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
  }),
};

const createShopType = {
  body: Joi.object().keys({
    name: Joi.string().required(),
  }),
};

const updateShopType = {
  params: Joi.object().keys({
    shopId: Joi.required().custom(objectId),
  }),
  body: Joi.object().keys({
    name: Joi.string().required(),
  }),
};

const deleteShopType = {
  params: Joi.object().keys({
    shopId: Joi.string().custom(objectId),
  }),
};

module.exports = {
  getShopTypes,
  createShopType,
  updateShopType,
  deleteShopType,
};
