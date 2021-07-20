const { Shop } = require('../models');

/**
 * Create a shop
 * @param {Object} shopBody
 * @returns {Promise<Shop>}
 */
const createShop = async (shopBody) => {
  const shop = await Shop.create(shopBody);
  return shop;
};

/**
 * Query for shops
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @param {number} [options.populate]
 * @returns {Promise<QueryResult>}
 */
const queryShops = async (filter, options) => {
  const optionsWithPopulate = options;
  optionsWithPopulate.populate = 'shopType';

  // eslint-disable-next-line no-console
  console.log(optionsWithPopulate);

  const shops = await Shop.paginate(filter, optionsWithPopulate);
  return shops;
};

/**
 * Get shop by id
 * @param {ObjectId} id
 * @returns {Promise<Shop>}
 */
const getShopById = async (id) => {
  return Shop.findById(id);
};

/**
 * Update shop
 * @param {Shop} shop
 * @param {Object} updateBody
 * @returns {Promise<Shop>}
 */
const updateShop = async (shop, updateBody) => {
  Object.assign(shop, updateBody);
  await shop.save();

  return shop;
};

/**
 * Delete shop
 * @param {Shop} shop
 * @returns {Promise<Shop>}
 */
const deleteShop = async (shop) => {
  await shop.remove();
  return shop;
};

module.exports = {
  createShop,
  queryShops,
  getShopById,
  updateShop,
  deleteShop,
};
