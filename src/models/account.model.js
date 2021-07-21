const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');
const { accountTypes } = require('../config/enums');

const accountSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  accountType: {
    type: String,
    enum: accountTypes,
    required: true,
  },
  isDefault: {
    type: Boolean,
    default: false,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User',
    private: true,
  },
});

// add plugin that converts mongoose to json
accountSchema.plugin(toJSON);
accountSchema.plugin(paginate);

/**
 * @typedef Account
 */
const Account = mongoose.model('Account', accountSchema);

module.exports = Account;
