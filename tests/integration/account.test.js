const request = require('supertest');
const faker = require('faker');
const httpStatus = require('http-status');
const app = require('../../src/app');

const setupTestDB = require('../utils/setupTestDB');

const { Account } = require('../../src/models');
const { userOne, userTwo, insertUsers } = require('../fixtures/user.fixture');
const { userOneAccessToken } = require('../fixtures/token.fixture');
const {
  newAccount,
  accountOne,
  accountTwo,
  accountThree,
  accountOfBank,
  accountOfCash,
  accountOfSavings,
  insertAccounts,
} = require('../fixtures/account.fixture');

const routePath = '/v1/account';

setupTestDB();

describe('Account routes', () => {
  describe('POST /v1/account', () => {
    test('should return 201 and successfully create new account if data is ok', async () => {
      await insertUsers([userOne]);

      const res = await request(app)
        .post(routePath)
        .set('Authorization', `Bearer ${userOneAccessToken}`)
        .send(newAccount)
        .expect(httpStatus.CREATED);

      expect(res.body).not.toHaveProperty('user');
      expect(res.body).toEqual({
        id: expect.anything(),
        name: newAccount.name,
        accountType: newAccount.accountType,
        isDefault: newAccount.isDefault,
      });

      const dbAccount = await Account.findById(res.body.id);
      expect(dbAccount).toBeDefined();
      expect(dbAccount).toMatchObject({
        name: newAccount.name,
        accountType: newAccount.accountType,
        isDefault: newAccount.isDefault,
      });
    });

    test('should return 401 error if access token is missing', async () => {
      await request(app).post(routePath).send(newAccount).expect(httpStatus.UNAUTHORIZED);
    });

    test('should return 400 error if all required properties are missing', async () => {
      await insertUsers([userOne]);

      const emptyAccount = {};

      await request(app)
        .post(routePath)
        .set('Authorization', `Bearer ${userOneAccessToken}`)
        .send(emptyAccount)
        .expect(httpStatus.BAD_REQUEST);
    });

    test('should return 400 error if accountType is missing', async () => {
      await insertUsers([userOne]);

      const invalidAccount = {
        name: faker.name.findName(),
        isDefault: faker.datatype.boolean(),
      };

      await request(app)
        .post(routePath)
        .set('Authorization', `Bearer ${userOneAccessToken}`)
        .send(invalidAccount)
        .expect(httpStatus.BAD_REQUEST);
    });

    test('should return 400 error if name is invalid', async () => {
      await insertUsers([userOne]);

      const invalidAccount = {
        accountType: 'Bank',
        isDefault: faker.datatype.boolean(),
      };

      await request(app)
        .post(routePath)
        .set('Authorization', `Bearer ${userOneAccessToken}`)
        .send(invalidAccount)
        .expect(httpStatus.BAD_REQUEST);
    });
  });

  describe('GET /v1/account', () => {
    test('should return 200 and apply the default query options', async () => {
      await insertUsers([userOne]);
      await insertAccounts([accountOne, accountTwo, accountThree], userOne);

      const res = await request(app)
        .get(routePath)
        .set('Authorization', `Bearer ${userOneAccessToken}`)
        .send()
        .expect(httpStatus.OK);

      expect(res.body).toEqual({
        results: expect.any(Array),
        page: 1,
        limit: 10,
        totalPages: 1,
        totalResults: 3,
      });
      expect(res.body.results).toHaveLength(3);
      expect(res.body.results[0]).toEqual({
        id: accountOne._id.toHexString(),
        name: accountOne.name,
        accountType: accountOne.accountType,
        isDefault: accountOne.isDefault,
      });
    });

    test('should return 401 error if access token is missing', async () => {
      await request(app).get(routePath).send().expect(httpStatus.UNAUTHORIZED);
    });

    test('should only return the accounts of the user', async () => {
      await insertUsers([userOne, userTwo]);
      await insertAccounts([accountOne, accountTwo], userOne);
      await insertAccounts([accountThree], userTwo);

      const res = await request(app)
        .get(routePath)
        .set('Authorization', `Bearer ${userOneAccessToken}`)
        .send()
        .expect(httpStatus.OK);

      expect(res.body).toEqual({
        results: expect.any(Array),
        page: 1,
        limit: 10,
        totalPages: 1,
        totalResults: 2,
      });
      expect(res.body.results).toHaveLength(2);
    });
  });

  describe('GET /v1/account?=params', () => {
    test('should only return accounts with account type Bank', async () => {
      await insertUsers([userOne]);
      await insertAccounts([accountOfBank, accountOfCash, accountOfSavings], userOne);

      const res = await request(app)
        .get(`${routePath}?accountType=Bank`)
        .set('Authorization', `Bearer ${userOneAccessToken}`)
        .send()
        .expect(httpStatus.OK);

      expect(res.body).toEqual({
        results: expect.any(Array),
        page: 1,
        limit: 10,
        totalPages: 1,
        totalResults: 1,
      });

      expect(res.body.results[0]).toEqual({
        id: accountOfBank._id.toHexString(),
        name: accountOfBank.name,
        accountType: accountOfBank.accountType,
        isDefault: accountOfBank.isDefault,
      });
    });

    test('should only return accounts with isDefault true', async () => {
      await insertUsers([userOne]);
      await insertAccounts([accountOfBank, accountOfCash, accountOfSavings], userOne);

      const res = await request(app)
        .get(`${routePath}?isDefault=true`)
        .set('Authorization', `Bearer ${userOneAccessToken}`)
        .send()
        .expect(httpStatus.OK);

      expect(res.body).toEqual({
        results: expect.any(Array),
        page: 1,
        limit: 10,
        totalPages: 1,
        totalResults: 2,
      });

      expect(res.body.results[0]).toEqual({
        id: accountOfBank._id.toHexString(),
        name: accountOfBank.name,
        accountType: accountOfBank.accountType,
        isDefault: true,
      });

      expect(res.body.results[1]).toEqual({
        id: accountOfSavings._id.toHexString(),
        name: accountOfSavings.name,
        accountType: accountOfSavings.accountType,
        isDefault: true,
      });
    });
  });

  describe('PATCH /v1/account/:accountId', () => {
    let updateAccount;

    beforeEach(() => {
      updateAccount = {
        name: faker.name.findName(),
      };
    });

    test('should return 200 and successfully update account', async () => {
      await insertUsers([userOne]);
      await insertAccounts([accountOne], userOne);

      const res = await request(app)
        .patch(`${routePath}/${accountOne._id}`)
        .set('Authorization', `Bearer ${userOneAccessToken}`)
        .send(updateAccount)
        .expect(httpStatus.OK);

      expect(res.body).toEqual({
        id: accountOne._id.toHexString(),
        name: updateAccount.name,
        accountType: accountOne.accountType,
        isDefault: accountOne.isDefault,
      });

      const result = await Account.find(accountOne._id);
      expect(result).toBeDefined();
    });

    test('should return 401 error if access token is missing', async () => {
      await insertUsers([userOne]);
      await insertAccounts([accountOne], userOne);

      await request(app).patch(`${routePath}/${accountOne._id}`).send(updateAccount).expect(httpStatus.UNAUTHORIZED);
    });

    test('should return 403 if user is updating account of other user', async () => {
      await insertUsers([userOne, userTwo]);
      await insertAccounts([accountOne], userOne);
      await insertAccounts([accountTwo], userTwo);

      await request(app)
        .patch(`${routePath}/${accountTwo._id}`)
        .set('Authorization', `Bearer ${userOneAccessToken}`)
        .send(updateAccount)
        .expect(httpStatus.FORBIDDEN);
    });

    test('should return 404 if user is updating account that is not found', async () => {
      await insertUsers([userOne]);

      await request(app)
        .patch(`${routePath}/${accountOne._id}`)
        .set('Authorization', `Bearer ${userOneAccessToken}`)
        .send(updateAccount)
        .expect(httpStatus.NOT_FOUND);
    });

    test('should return 400 error if userId is not a valid mongo id', async () => {
      await insertUsers([userOne]);

      await request(app)
        .patch(`${routePath}/invalid`)
        .set('Authorization', `Bearer ${userOneAccessToken}`)
        .send(updateAccount)
        .expect(httpStatus.BAD_REQUEST);
    });
  });

  describe('DELETE /v1/account/:accountId', () => {
    test('should return 204 if data is ok', async () => {
      await insertUsers([userOne]);
      await insertAccounts([accountOne], userOne);

      await request(app)
        .delete(`${routePath}/${accountOne._id}`)
        .set('Authorization', `Bearer ${userOneAccessToken}`)
        .send()
        .expect(httpStatus.NO_CONTENT);

      const account = await Account.findById(accountOne._id);
      expect(account).toBeNull();
    });

    test('should return 401 error if access token is missing', async () => {
      await insertUsers([userOne]);
      await insertAccounts([accountOne], userOne);

      await request(app).delete(`${routePath}/${accountOne._id}`).send().expect(httpStatus.UNAUTHORIZED);
    });

    test('should return 403 if user is deleting account of other user', async () => {
      await insertUsers([userOne, userTwo]);
      await insertAccounts([accountOne], userOne);
      await insertAccounts([accountTwo], userTwo);

      await request(app)
        .delete(`${routePath}/${accountTwo._id}`)
        .set('Authorization', `Bearer ${userOneAccessToken}`)
        .send()
        .expect(httpStatus.FORBIDDEN);
    });

    test('should return 404 if user is deleting account that is not found', async () => {
      await insertUsers([userOne]);

      await request(app)
        .delete(`${routePath}/${accountOne._id}`)
        .set('Authorization', `Bearer ${userOneAccessToken}`)
        .send()
        .expect(httpStatus.NOT_FOUND);
    });

    test('should return 400 error if userId is not a valid mongo id', async () => {
      await insertUsers([userOne]);

      await request(app)
        .delete(`${routePath}/invalid`)
        .set('Authorization', `Bearer ${userOneAccessToken}`)
        .send()
        .expect(httpStatus.BAD_REQUEST);
    });
  });
});
