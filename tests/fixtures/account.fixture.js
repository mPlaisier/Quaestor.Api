const mongoose = require('mongoose');
const faker = require('faker');
const { Account } = require('../../src/models');
const { accountTypes } = require('../../src/config/enums');

const newAccount = {
  name: faker.name.findName(),
  accountType: faker.random.arrayElement(accountTypes),
  isDefault: faker.datatype.boolean(),
};

const accountOne = {
  _id: mongoose.Types.ObjectId(),
  name: faker.name.findName(),
  accountType: faker.random.arrayElement(accountTypes),
  isDefault: faker.datatype.boolean(),
};

const accountTwo = {
  _id: mongoose.Types.ObjectId(),
  name: faker.name.findName(),
  accountType: faker.random.arrayElement(accountTypes),
  isDefault: faker.datatype.boolean(),
};

const accountThree = {
  _id: mongoose.Types.ObjectId(),
  name: faker.name.findName(),
  accountType: faker.random.arrayElement(accountTypes),
  isDefault: faker.datatype.boolean(),
};

const accountOfBank = {
  _id: mongoose.Types.ObjectId(),
  name: faker.name.findName(),
  accountType: 'Bank',
  isDefault: true,
};

const accountOfSavings = {
  _id: mongoose.Types.ObjectId(),
  name: faker.name.findName(),
  accountType: 'Savings',
  isDefault: true,
};

const accountOfCash = {
  _id: mongoose.Types.ObjectId(),
  name: faker.name.findName(),
  accountType: 'Cash',
  isDefault: false,
};

const insertAccounts = async (accounts, user) => {
  await Account.insertMany(accounts.map((account) => ({ ...account, user })));
};

module.exports = {
  newAccount,
  accountOne,
  accountTwo,
  accountThree,
  accountOfBank,
  accountOfSavings,
  accountOfCash,
  insertAccounts,
};
