const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');

const lineItemCategorySchema = new mongoose.Schema({
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
lineItemCategorySchema.plugin(toJSON);
lineItemCategorySchema.plugin(paginate);

/**
 * @typedef LineItemCategory
 */
const LineItemCategory = mongoose.model('LineItemCategory', lineItemCategorySchema);

module.exports = LineItemCategory;
