const mongoose = require('mongoose');
const faker = require('faker');
const { Account } = require('../../../src/models');

describe('Account model', () => {
  describe('Account validation', () => {
    let newAccount;
    beforeEach(() => {
      newAccount = {
        name: faker.name.findName(),
        accountType: 'Bank',
        isDefault: true,
        user: mongoose.Types.ObjectId(),
      };
    });

    test('should correctly validate a valid account', async () => {
      await expect(new Account(newAccount).validate()).resolves.toBeUndefined();
    });

    test('should throw a validation error if accountType is unknown', async () => {
      newAccount.accountType = 'invalid';
      await expect(new Account(newAccount).validate()).rejects.toThrow();
    });
  });

  describe('Account toJSON()', () => {
    test('should not return user when toJSON is called', () => {
      const newUser = {
        name: faker.name.findName(),
        accountType: 'Bank',
        isDefault: true,
        user: mongoose.Types.ObjectId(),
      };
      expect(new Account(newUser).toJSON()).not.toHaveProperty('user');
    });
  });
});
