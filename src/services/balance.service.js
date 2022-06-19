const { Balance } = require('../models');

/**
 * Create a balance
 * @param {Object} balanceBody
 * @returns {Promise<Balance>}
 */
const createBalance = async (balanceBody) => {
  const balance = await Balance.create(balanceBody);
  return balance;
};

/**
 * Query for balances
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @param {number} [options.populate]
 * @returns {Promise<QueryResult>}
 */
const queryBalances = async (filter, options) => {
  const optionsWithPopulate = options;
  optionsWithPopulate.populate = 'account';

  const balances = await Balance.paginate(filter, optionsWithPopulate);
  return balances;
};

/**
 * Get balance by id
 * @param {ObjectId} id
 * @returns {Promise<Balance>}
 */
const getBalanceById = async (id) => {
  return Balance.findById(id);
};

/**
 * Update balance
 * @param {Balance} balance
 * @param {Object} updateBody
 * @returns {Promise<Balance>}
 */
const updateBalance = async (balance, updateBody) => {
  Object.assign(balance, updateBody);
  await balance.save();

  return balance;
};

/**
 * Delete balance
 * @param {Balance} balance
 * @returns {Promise<Balance>}
 */
const deleteBalance = async (balance) => {
  await balance.remove();
  return balance;
};

module.exports = {
  createBalance,
  queryBalances,
  getBalanceById,
  updateBalance,
  deleteBalance,
};
