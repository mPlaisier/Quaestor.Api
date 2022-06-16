const { LineContainer } = require('../models');

const myCustomLabels = {
  docs: 'results',
  totalDocs: 'totalResults',
};

/**
 * Create a line container
 * @param {Object} lineContainerBody
 * @returns {Promise<LineContainer>}
 */
const createLineContainer = async (lineContainerBody) => {
  const lineContainer = await LineContainer.create(lineContainerBody);
  return lineContainer;
};

/**
 * Query for line containers
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */
const queryLineContainers = async (filter, options) => {
  const optionsWithPopulate = options;
  optionsWithPopulate.populate = [
    'lineItems.lineCategory',
    'lineItems.account',
    {
      path: 'shop',
      populate: 'shopType',
    },
  ];
  optionsWithPopulate.customLabels = myCustomLabels;

  const lineContainers = await LineContainer.paginate(filter, optionsWithPopulate);
  return lineContainers;
};

/**
 * Get line container by id
 * @param {ObjectId} id
 * @returns {Promise<Container>}
 */
const getLineContainerById = async (id) => {
  return LineContainer.findById(id);
};

/**
 * Update line container
 * @param {LineContainer} lineContainer
 * @param {Object} updateBody
 * @returns {Promise<LineContainer>}
 */
const updateLineContainer = async (lineContainer, updateBody) => {
  Object.assign(lineContainer, updateBody);
  await lineContainer.save();

  return lineContainer;
};

/**
 * Delete line container
 * @param {LineContainer} container
 * @returns {Promise<LineContainer>}
 */
const deleteLineContainer = async (lineContainer) => {
  await lineContainer.remove();
  return lineContainer;
};

module.exports = {
  createLineContainer,
  queryLineContainers,
  getLineContainerById,
  updateLineContainer,
  deleteLineContainer,
};
