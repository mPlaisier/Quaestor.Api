const mongoose = require('mongoose');
const faker = require('faker');
const LineContainer = require('../../src/models/lineContainer.model');

const lineContainerOne = {
  date: Date.now(),
  shop: mongoose.Types.ObjectId(),
  totalAmount: faker.datatype.number({ min: 1, max: 5, precision: 0.01 }),
  month: 8,
  year: 2021,
  lineItems: [
    {
      description: faker.lorem.sentence(5),
      lineCategory: mongoose.Types.ObjectId(),
      amount: faker.datatype.number({ min: 1, max: 5, precision: 0.01 }),
      account: mongoose.Types.ObjectId(),
      paymentType: 'Expense',
    },
    {
      description: faker.lorem.sentence(5),
      lineCategory: mongoose.Types.ObjectId(),
      amount: faker.datatype.number({ min: 1, max: 5, precision: 0.01 }),
      account: mongoose.Types.ObjectId(),
      paymentType: 'Expense',
    },
    {
      description: faker.lorem.sentence(5),
      lineCategory: mongoose.Types.ObjectId(),
      amount: faker.datatype.number({ min: 1, max: 5, precision: 0.01 }),
      account: mongoose.Types.ObjectId(),
      paymentType: 'Expense',
    },
  ],
};

const lineContainerTwo = {
  date: Date.now(),
  shop: mongoose.Types.ObjectId(),
  totalAmount: faker.datatype.number({ min: 1, max: 5, precision: 0.01 }),
  month: 8,
  year: 2021,
  lineItems: [
    {
      description: faker.lorem.sentence(5),
      lineCategory: mongoose.Types.ObjectId(),
      amount: faker.datatype.number({ min: 1, max: 5, precision: 0.01 }),
      account: mongoose.Types.ObjectId(),
      paymentType: 'Expense',
    },
    {
      description: faker.lorem.sentence(5),
      lineCategory: mongoose.Types.ObjectId(),
      amount: faker.datatype.number({ min: 1, max: 5, precision: 0.01 }),
      account: mongoose.Types.ObjectId(),
      paymentType: 'Expense',
    },
    {
      description: faker.lorem.sentence(5),
      lineCategory: mongoose.Types.ObjectId(),
      amount: faker.datatype.number({ min: 1, max: 5, precision: 0.01 }),
      account: mongoose.Types.ObjectId(),
      paymentType: 'Expense',
    },
  ],
};

const lineContainerThree = {
  date: Date.now(),
  shop: mongoose.Types.ObjectId(),
  totalAmount: faker.datatype.number({ min: 1, max: 5, precision: 0.01 }),
  month: 8,
  year: 2021,
  lineItems: [
    {
      description: faker.lorem.sentence(5),
      lineCategory: mongoose.Types.ObjectId(),
      amount: faker.datatype.number({ min: 1, max: 5, precision: 0.01 }),
      account: mongoose.Types.ObjectId(),
      paymentType: 'Expense',
    },
    {
      description: faker.lorem.sentence(5),
      lineCategory: mongoose.Types.ObjectId(),
      amount: faker.datatype.number({ min: 1, max: 5, precision: 0.01 }),
      account: mongoose.Types.ObjectId(),
      paymentType: 'Expense',
    },
    {
      description: faker.lorem.sentence(5),
      lineCategory: mongoose.Types.ObjectId(),
      amount: faker.datatype.number({ min: 1, max: 5, precision: 0.01 }),
      account: mongoose.Types.ObjectId(),
      paymentType: 'Expense',
    },
  ],
};

const insertLineContainers = async (lineContainers, user) => {
  await LineContainer.insertMany(lineContainers.map((lineContainer) => ({ ...lineContainer, user })));
};

module.exports = {
  lineContainerOne,
  lineContainerTwo,
  lineContainerThree,
  insertLineContainers,
};
