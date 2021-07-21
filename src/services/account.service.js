const { Account } = require('../models');

/**
 * Create an account
 * @param {Object} accountBody
 * @returns {Promise<Account>}
 */
const createAccount = async (accountBody) => {
  const result = await Account.create(accountBody);
  return result;
};

/**
 * Query for accounts
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @param {number} [options.populate]
 * @returns {Promise<QueryResult>}
 */
const queryAccounts = async (filter, options) => {
  const result = await Account.paginate(filter, options);
  return result;
};

/**
 * Get account by id
 * @param {ObjectId} id
 * @returns {Promise<Account>}
 */
const getAccountById = async (id) => {
  return Account.findById(id);
};

/**
 * Update account
 * @param {Account} account
 * @param {Object} updateBody
 * @returns {Promise<Account>}
 */
const updateAccount = async (account, updateBody) => {
  Object.assign(account, updateBody);
  await account.save();

  return account;
};

/**
 * Delete account
 * @param {Account} account
 * @returns {Promise<Account>}
 */
const deleteAccount = async (account) => {
  await account.remove();
  return account;
};

module.exports = {
  createAccount,
  queryAccounts,
  getAccountById,
  updateAccount,
  deleteAccount,
};
