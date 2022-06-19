const mongoose = require('mongoose');
const decimalConverter = require('../utils/decimalConverter');
const { toJSON, paginate } = require('./plugins');

const balanceSchema = new mongoose.Schema(
  {
    month: {
      type: Number,
      min: 1,
      max: 12,
      required: true,
    },
    year: {
      type: Number,
      min: 2019,
      max: 2100,
      required: true,
    },
    account: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'Account',
    },
    amount: {
      type: mongoose.Decimal128,
      required: true,
      get: decimalConverter,
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
balanceSchema.plugin(toJSON);
balanceSchema.plugin(paginate);

/**
 * @typedef Balance
 */
const Balance = mongoose.model('Balance', balanceSchema);

module.exports = Balance;
