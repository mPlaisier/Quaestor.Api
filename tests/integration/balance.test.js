const request = require('supertest');
const httpStatus = require('http-status');
const app = require('../../src/app');

const setupTestDB = require('../utils/setupTestDB');

const { Balance } = require('../../src/models');
const { userOne, userTwo, insertUsers } = require('../fixtures/user.fixture');
const { userOneAccessToken } = require('../fixtures/token.fixture');
const {
  createBalance,
  createBalanceWithoutMonth,
  createBalanceWithoutYear,
  balanceOne,
  balanceTwo,
  balanceThree,
  insertBalances,
} = require('../fixtures/balance.fixture');

const routePath = '/v1/balance';

setupTestDB();

describe('Balances routes', () => {
  describe('POST /v1/balance', () => {
    test('should return 201 and successfully create new balance if data is ok', async () => {
      await insertUsers([userOne]);

      const res = await request(app)
        .post(routePath)
        .set('Authorization', `Bearer ${userOneAccessToken}`)
        .send(createBalance)
        .expect(httpStatus.CREATED);

      expect(res.body).not.toHaveProperty('user');
      expect(res.body).toMatchObject({
        id: expect.anything(),
        month: createBalance.month,
        year: createBalance.year,
        amount: createBalance.amount,
      });

      const dbBalance = await Balance.findById(res.body.id);
      expect(dbBalance).toBeDefined();
      expect(dbBalance).toMatchObject({
        month: createBalance.month,
        year: createBalance.year,
        amount: createBalance.amount,
      });
    });

    test('should return 401 error if access token is missing', async () => {
      await request(app).post(routePath).send(createBalance).expect(httpStatus.UNAUTHORIZED);
    });

    test('should return 400 error if all required properties are missing', async () => {
      await insertUsers([userOne]);

      const emptyBalance = {};

      await request(app)
        .post(routePath)
        .set('Authorization', `Bearer ${userOneAccessToken}`)
        .send(emptyBalance)
        .expect(httpStatus.BAD_REQUEST);
    });

    test('should return 400 error if month is missing', async () => {
      await insertUsers([userOne]);

      await request(app)
        .post(routePath)
        .set('Authorization', `Bearer ${userOneAccessToken}`)
        .send(createBalanceWithoutMonth)
        .expect(httpStatus.BAD_REQUEST);
    });

    test('should return 400 error if year is missing', async () => {
      await insertUsers([userOne]);

      await request(app)
        .post(routePath)
        .set('Authorization', `Bearer ${userOneAccessToken}`)
        .send(createBalanceWithoutYear)
        .expect(httpStatus.BAD_REQUEST);
    });
  });

  describe('GET /v1/balance?month=M&year=YYYY', () => {
    test('should return 200 and apply the default query options', async () => {
      await insertUsers([userOne]);
      await insertBalances([balanceOne, balanceTwo, balanceThree], userOne);

      const res = await request(app)
        .get(`${routePath}?month=${balanceOne.month}&year=${balanceOne.year}`)
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
      expect(res.body.results[0]).toMatchObject({
        id: balanceOne._id.toHexString(),
        month: balanceOne.month,
        year: balanceOne.year,
        amount: balanceOne.amount,
      });
    });

    test('should return 401 error if access token is missing', async () => {
      await request(app).get(routePath).send().expect(httpStatus.UNAUTHORIZED);
    });

    test('should only return the balances of the user', async () => {
      await insertUsers([userOne, userTwo]);
      await insertBalances([balanceOne, balanceTwo], userOne);
      await insertBalances([balanceThree], userTwo);

      const res = await request(app)
        .get(`${routePath}?month=${balanceOne.month}&year=${balanceOne.year}`)
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

  describe('PATCH /v1/balance/:balanceId', () => {
    let updateBalance;

    beforeEach(() => {
      updateBalance = {
        month: 7,
      };
    });

    test('should return 200 and successfully update balance', async () => {
      await insertUsers([userOne]);
      await insertBalances([balanceOne], userOne);

      const res = await request(app)
        .patch(`${routePath}/${balanceOne._id}`)
        .set('Authorization', `Bearer ${userOneAccessToken}`)
        .send(updateBalance)
        .expect(httpStatus.OK);

      expect(res.body).toMatchObject({
        id: balanceOne._id.toHexString(),
        month: updateBalance.month,
        year: balanceOne.year,
        amount: balanceOne.amount,
      });

      const result = await Balance.find(balanceOne._id);
      expect(result).toBeDefined();
    });

    test('should return 401 error if access token is missing', async () => {
      await insertUsers([userOne]);
      await insertBalances([balanceOne], userOne);

      await request(app).patch(`${routePath}/${balanceOne._id}`).send(updateBalance).expect(httpStatus.UNAUTHORIZED);
    });

    test('should return 403 if user is updating balance of other user', async () => {
      await insertUsers([userOne, userTwo]);
      await insertBalances([balanceOne], userOne);
      await insertBalances([balanceTwo], userTwo);

      await request(app)
        .patch(`${routePath}/${balanceTwo._id}`)
        .set('Authorization', `Bearer ${userOneAccessToken}`)
        .send(updateBalance)
        .expect(httpStatus.FORBIDDEN);
    });

    test('should return 404 if user is updating balance that is not found', async () => {
      await insertUsers([userOne]);

      await request(app)
        .patch(`${routePath}/${balanceOne._id}`)
        .set('Authorization', `Bearer ${userOneAccessToken}`)
        .send(updateBalance)
        .expect(httpStatus.NOT_FOUND);
    });

    test('should return 400 error if balanceId is not a valid mongo id', async () => {
      await insertUsers([userOne]);

      await request(app)
        .patch(`${routePath}/invalid`)
        .set('Authorization', `Bearer ${userOneAccessToken}`)
        .send(updateBalance)
        .expect(httpStatus.BAD_REQUEST);
    });
  });

  describe('DELETE /v1/balance/:balanceId', () => {
    test('should return 204 if data is ok', async () => {
      await insertUsers([userOne]);
      await insertBalances([balanceOne], userOne);

      await request(app)
        .delete(`${routePath}/${balanceOne._id}`)
        .set('Authorization', `Bearer ${userOneAccessToken}`)
        .send()
        .expect(httpStatus.NO_CONTENT);

      const balance = await Balance.findById(balanceOne._id);
      expect(balance).toBeNull();
    });

    test('should return 401 error if access token is missing', async () => {
      await insertUsers([userOne]);
      await insertBalances([balanceOne], userOne);

      await request(app).delete(`${routePath}/${balanceOne._id}`).send().expect(httpStatus.UNAUTHORIZED);
    });

    test('should return 403 if user is deleting balance of other user', async () => {
      await insertUsers([userOne, userTwo]);
      await insertBalances([balanceOne], userOne);
      await insertBalances([balanceTwo], userTwo);

      await request(app)
        .delete(`${routePath}/${balanceTwo._id}`)
        .set('Authorization', `Bearer ${userOneAccessToken}`)
        .send()
        .expect(httpStatus.FORBIDDEN);
    });

    test('should return 404 if user is deleting balance that is not found', async () => {
      await insertUsers([userOne]);

      await request(app)
        .delete(`${routePath}/${balanceOne._id}`)
        .set('Authorization', `Bearer ${userOneAccessToken}`)
        .send()
        .expect(httpStatus.NOT_FOUND);
    });

    test('should return 400 error if balanceId is not a valid mongo id', async () => {
      await insertUsers([userOne]);

      await request(app)
        .delete(`${routePath}/invalid`)
        .set('Authorization', `Bearer ${userOneAccessToken}`)
        .send()
        .expect(httpStatus.BAD_REQUEST);
    });
  });
});
