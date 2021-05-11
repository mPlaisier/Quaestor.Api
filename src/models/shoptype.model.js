const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');

const shopTypeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User',
    private: true,
  },
});

// add plugin that converts mongoose to json
shopTypeSchema.plugin(toJSON);
shopTypeSchema.plugin(paginate);

/**
 * @typedef ShopType
 */
const ShopType = mongoose.model('ShopType', shopTypeSchema);

module.exports = ShopType;
