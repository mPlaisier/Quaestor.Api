const { ShopType } = require('../models');

/**
 * Create a shop type
 * @param {Object} shopTypeBody
 * @returns {Promise<ShopType>}
 */
const createShopType = async (shopTypeBody) => {
  const shopType = await ShopType.create(shopTypeBody);
  return shopType;
};

/**
 * Query for shop types
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */
const queryShopTypes = async (filter, options) => {
  const shopTypes = await ShopType.paginate(filter, options);
  return shopTypes;
};

/**
 * Get shop type by id
 * @param {ObjectId} id
 * @returns {Promise<ShopType>}
 */
const getShopTypeById = async (id) => {
  return ShopType.findById(id);
};

/**
 * Update shop type by id
 * @param {ObjectId} shopTypeId
 * @param {Object} updateBody
 * @returns {Promise<ShopType>}
 */
const updateShopType = async (shopType, updateBody) => {
  Object.assign(shopType, updateBody);
  await shopType.save();

  return shopType;
};

/**
 * Delete shop type by id
 * @param {ObjectId} shopTypeId
 * @returns {Promise<ShopType>}
 */
const deleteShopType = async (shopType) => {
  await shopType.remove();
  return shopType;
};

module.exports = {
  createShopType,
  queryShopTypes,
  getShopTypeById,
  updateShopType,
  deleteShopType,
};
