const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');
const { goalTypes } = require('../config/enums');
const decimalConverter = require('../utils/decimalConverter');

const goalSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: false,
      trim: true,
    },
    amount: {
      type: mongoose.Decimal128,
      required: true,
      get: decimalConverter,
    },
    account: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'Account',
    },
    goalType: {
      type: String,
      enum: goalTypes,
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
      private: true,
    },
  },
  { toJSON: { getters: true } }
);

// add plugin that converts mongoose to json
goalSchema.plugin(toJSON);
goalSchema.plugin(paginate);

/**
 * @typedef Goal
 */
const Goal = mongoose.model('Goal', goalSchema);

module.exports = Goal;
