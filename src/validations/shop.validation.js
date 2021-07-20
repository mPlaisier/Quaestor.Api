const Joi = require('joi');
const { objectId } = require('./custom.validation');

const getShops = {
  query: Joi.object().keys({
    sortBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
  }),
};

const createShop = {
  body: Joi.object().keys({
    name: Joi.string().required(),
    shopType: Joi.string().custom(objectId).required(),
  }),
};

const updateShop = {
  params: Joi.object().keys({
    shopId: Joi.required().custom(objectId),
  }),
  body: Joi.object().keys({
    name: Joi.string().required(),
    shopType: Joi.string().custom(objectId),
  }),
};

const deleteShop = {
  params: Joi.object().keys({
    shopId: Joi.string().custom(objectId),
  }),
};

module.exports = {
  getShops,
  createShop,
  updateShop,
  deleteShop,
};
