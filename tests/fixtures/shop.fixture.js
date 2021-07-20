const mongoose = require('mongoose');
const faker = require('faker');
const Shop = require('../../src/models/shop.model');

const createShop = {
  name: faker.name.findName(),
  shopType: mongoose.Types.ObjectId(),
};
const shopOne = {
  _id: mongoose.Types.ObjectId(),
  name: faker.name.findName(),
};

const shopTwo = {
  _id: mongoose.Types.ObjectId(),
  name: faker.name.findName(),
};

const shopThree = {
  _id: mongoose.Types.ObjectId(),
  name: faker.name.findName(),
};

const insertShops = async (shops, user) => {
  await Shop.insertMany(shops.map((shop) => ({ ...shop, user })));
};

module.exports = {
  createShop,
  shopOne,
  shopTwo,
  shopThree,
  insertShops,
};
