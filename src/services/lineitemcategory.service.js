const { LineItemCategory } = require('../models');

/**
 * Create a line-item category
 * @param {Object} lineItemCategoryBody
 * @returns {Promise<LineItemCategory>}
 */
const createLineItemCategory = async (lineItemCategoryBody) => {
  const lineItemCategory = await LineItemCategory.create(lineItemCategoryBody);
  return lineItemCategory;
};

/**
 * Query for line-item categories
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */
const queryLineItemCategories = async (filter, options) => {
  const lineItemCategories = await LineItemCategory.paginate(filter, options);
  return lineItemCategories;
};

/**
 * Get line-item category by id
 * @param {ObjectId} id
 * @returns {Promise<LineItemCategory>}
 */
const getLineItemCategoryById = async (id) => {
  return LineItemCategory.findById(id);
};

/**
 * Update line-item category
 * @param {ObjectId} lineItemCategoryId
 * @param {Object} updateBody
 * @returns {Promise<LineItemCategory>}
 */
const updateLineItemCategory = async (lineItemCategory, updateBody) => {
  Object.assign(lineItemCategory, updateBody);
  await lineItemCategory.save();

  return lineItemCategory;
};

/**
 * Delete line-item category
 * @param {ObjectId} lineItemCategoryId
 * @returns {Promise<LineItemCategory>}
 */
const deleteLineItemCategory = async (lineItemCategory) => {
  await lineItemCategory.remove();
  return lineItemCategory;
};

module.exports = {
  createLineItemCategory,
  queryLineItemCategories,
  getLineItemCategoryById,
  updateLineItemCategory,
  deleteLineItemCategory,
};
