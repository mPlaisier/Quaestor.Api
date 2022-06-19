const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');
const { toJSON } = require('./plugins');
const { paymentTypes } = require('../config/enums');
const decimalConverter = require('../utils/decimalConverter');

const lineContainerItem = new mongoose.Schema(
  {
    _id: false,
    id: {
      type: String,
      private: false,
    },
    description: {
      type: String,
      trim: true,
    },
    lineCategory: {
      type: mongoose.Schema.Types.ObjectId,
      required: false,
      ref: 'LineItemCategory',
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
    paymentType: {
      type: String,
      enum: paymentTypes,
      required: true,
    },
  },
  { toJSON: { getters: true } }
);

const lineContainerSchema = new mongoose.Schema(
  {
    date: {
      type: Date,
      trim: true,
      require: true,
    },
    shop: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'Shop',
    },
    totalAmount: {
      type: mongoose.Decimal128,
      required: true,
      get: decimalConverter,
    },
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
    lineItems: [lineContainerItem],
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
lineContainerSchema.plugin(toJSON);
lineContainerSchema.plugin(mongoosePaginate);

/**
 * @typedef LineContainer
 */
const LineContainer = mongoose.model('LineContainer', lineContainerSchema);

module.exports = LineContainer;
