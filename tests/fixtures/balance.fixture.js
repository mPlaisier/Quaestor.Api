const mongoose = require('mongoose');
const faker = require('faker');
const Balance = require('../../src/models/balance.model');

const createBalance = {
  month: 6,
  year: 2022,
  account: mongoose.Types.ObjectId(),
  amount: faker.datatype.number({ min: 1, max: 3000, precision: 0.01 }),
};

const createBalanceWithoutMonth = {
  year: 2022,
  account: mongoose.Types.ObjectId(),
  amount: faker.datatype.number({ min: 1, max: 10000, precision: 0.01 }),
};

const createBalanceWithoutYear = {
  month: 6,
  account: mongoose.Types.ObjectId(),
  amount: faker.datatype.number({ min: 1, max: 10000, precision: 0.01 }),
};

const balanceOne = {
  _id: mongoose.Types.ObjectId(),
  month: 6,
  year: 2022,
  account: mongoose.Types.ObjectId(),
  amount: faker.datatype.number({ min: 1, max: 10000, precision: 0.01 }),
};

const balanceTwo = {
  _id: mongoose.Types.ObjectId(),
  month: 6,
  year: 2022,
  account: mongoose.Types.ObjectId(),
  amount: faker.datatype.number({ min: 1, max: 10000, precision: 0.01 }),
};

const balanceThree = {
  _id: mongoose.Types.ObjectId(),
  month: 6,
  year: 2022,
  account: mongoose.Types.ObjectId(),
  amount: faker.datatype.number({ min: 1, max: 10000, precision: 0.01 }),
};

const insertBalances = async (balances, user) => {
  await Balance.insertMany(balances.map((balance) => ({ ...balance, user })));
};

module.exports = {
  createBalance,
  createBalanceWithoutMonth,
  createBalanceWithoutYear,
  balanceOne,
  balanceTwo,
  balanceThree,
  insertBalances,
};
