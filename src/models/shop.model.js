const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');

const shopSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  shopType: {
    type: mongoose.Schema.Types.ObjectId,
    required: false,
    ref: 'ShopType',
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User',
    private: true,
  },
});

// add plugin that converts mongoose to json
shopSchema.plugin(toJSON);
shopSchema.plugin(paginate);

/**
 * @typedef Shop
 */
const Shop = mongoose.model('Shop', shopSchema);

module.exports = Shop;
