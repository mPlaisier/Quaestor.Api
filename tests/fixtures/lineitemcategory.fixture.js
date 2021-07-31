const mongoose = require('mongoose');
const faker = require('faker');
const LineItemCategory = require('../../src/models/lineitemcategory.model');

const lineItemCategoryOne = {
  _id: mongoose.Types.ObjectId(),
  name: faker.name.findName(),
};

const lineItemCategoryTwo = {
  _id: mongoose.Types.ObjectId(),
  name: faker.name.findName(),
};

const lineItemCategoryThree = {
  _id: mongoose.Types.ObjectId(),
  name: faker.name.findName(),
};

const insertLineItemCategories = async (lineItemCategories, user) => {
  await LineItemCategory.insertMany(lineItemCategories.map((shoptype) => ({ ...shoptype, user })));
};

module.exports = {
  lineItemCategoryOne,
  lineItemCategoryTwo,
  lineItemCategoryThree,
  insertLineItemCategories,
};
