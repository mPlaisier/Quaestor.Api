const mongoose = require('mongoose');
const faker = require('faker');
const Goal = require('../../src/models/goal.model');
const { goalTypes } = require('../../src/config/enums');

const createGoal = {
  name: faker.name.findName(),
  description: faker.name.findName(),
  amount: faker.datatype.number({ min: 1, max: 5000, precision: 0.01 }),
  account: mongoose.Types.ObjectId(),
  goalType: faker.random.arrayElement(goalTypes),
};

const createGoalAmountSaved = {
  _id: mongoose.Types.ObjectId(),
  name: faker.name.findName(),
  description: faker.name.findName(),
  amount: faker.datatype.number({ min: 1, max: 5000, precision: 0.01 }),
  account: mongoose.Types.ObjectId(),
  goalType: 'AmountSaved',
};

const createGoalAmountReached = {
  _id: mongoose.Types.ObjectId(),
  name: faker.name.findName(),
  description: faker.name.findName(),
  amount: faker.datatype.number({ min: 1, max: 5000, precision: 0.01 }),
  account: mongoose.Types.ObjectId(),
  goalType: 'AmountReached',
};

const goalOne = {
  _id: mongoose.Types.ObjectId(),
  name: faker.name.findName(),
  description: faker.name.findName(),
  amount: faker.datatype.number({ min: 1, max: 5000, precision: 0.01 }),
  account: mongoose.Types.ObjectId(),
  goalType: faker.random.arrayElement(goalTypes),
};

const goalTwo = {
  _id: mongoose.Types.ObjectId(),
  name: faker.name.findName(),
  description: faker.name.findName(),
  amount: faker.datatype.number({ min: 1, max: 5000, precision: 0.01 }),
  account: mongoose.Types.ObjectId(),
  goalType: faker.random.arrayElement(goalTypes),
};

const goalThree = {
  _id: mongoose.Types.ObjectId(),
  name: faker.name.findName(),
  description: faker.name.findName(),
  amount: faker.datatype.number({ min: 1, max: 5000, precision: 0.01 }),
  account: mongoose.Types.ObjectId(),
  goalType: faker.random.arrayElement(goalTypes),
};

const goalWithoutName = {
  description: faker.name.findName(),
  amount: faker.datatype.number({ min: 1, max: 5000, precision: 0.01 }),
  account: mongoose.Types.ObjectId(),
  goalType: faker.random.arrayElement(goalTypes),
};

const goalInvalidGoalType = {
  name: faker.name.findName(),
  description: faker.name.findName(),
  amount: faker.datatype.number({ min: 1, max: 5000, precision: 0.01 }),
  account: mongoose.Types.ObjectId(),
  goalType: 'invalid',
};

const insertGoals = async (goals, user) => {
  await Goal.insertMany(goals.map((goal) => ({ ...goal, user })));
};

module.exports = {
  createGoal,
  createGoalAmountSaved,
  createGoalAmountReached,
  goalOne,
  goalTwo,
  goalThree,
  goalWithoutName,
  goalInvalidGoalType,
  insertGoals,
};
