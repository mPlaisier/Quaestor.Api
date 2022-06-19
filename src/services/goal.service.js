const { Goal } = require('../models');

/**
 * Create a goal
 * @param {Object} goalBody
 * @returns {Promise<Goal>}
 */
const createGoal = async (goalBody) => {
  const goal = await Goal.create(goalBody);
  return goal;
};

/**
 * Query for goals
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @param {number} [options.populate]
 * @returns {Promise<QueryResult>}
 */
const queryGoals = async (filter, options) => {
  const optionsWithPopulate = options;
  optionsWithPopulate.populate = 'account';

  const goals = await Goal.paginate(filter, optionsWithPopulate);
  return goals;
};

/**
 * Get goal by id
 * @param {ObjectId} id
 * @returns {Promise<Goal>}
 */
const getGoalById = async (id) => {
  return Goal.findById(id);
};

/**
 * Update goal
 * @param {Goal} goal
 * @param {Object} updateBody
 * @returns {Promise<Goal>}
 */
const updateGoal = async (goal, updateBody) => {
  Object.assign(goal, updateBody);
  await goal.save();

  return goal;
};

/**
 * Delete goal
 * @param {Goal} goal
 * @returns {Promise<Goal>}
 */
const deleteGoal = async (goal) => {
  await goal.remove();
  return goal;
};

module.exports = {
  createGoal,
  queryGoals,
  getGoalById,
  updateGoal,
  deleteGoal,
};
