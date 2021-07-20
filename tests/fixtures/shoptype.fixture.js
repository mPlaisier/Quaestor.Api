const mongoose = require('mongoose');
const faker = require('faker');
const ShopType = require('../../src/models/shoptype.model');

const shopTypeOne = {
  _id: mongoose.Types.ObjectId(),
  name: faker.name.findName(),
};

const shopTypeTwo = {
  _id: mongoose.Types.ObjectId(),
  name: faker.name.findName(),
};

const shopTypeThree = {
  _id: mongoose.Types.ObjectId(),
  name: faker.name.findName(),
};

const insertShopTypes = async (shopTypes, user) => {
  await ShopType.insertMany(shopTypes.map((shoptype) => ({ ...shoptype, user })));
};

module.exports = {
  shopTypeOne,
  shopTypeTwo,
  shopTypeThree,
  insertShopTypes,
};
