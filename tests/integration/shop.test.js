const request = require('supertest');
const faker = require('faker');
const httpStatus = require('http-status');
const app = require('../../src/app');
const setupTestDB = require('../utils/setupTestDB');
const { Shop } = require('../../src/models');
const { userOne, userTwo, insertUsers } = require('../fixtures/user.fixture');
const { userOneAccessToken } = require('../fixtures/token.fixture');
const { createShop, shopOne, shopTwo, shopThree, insertShops } = require('../fixtures/shop.fixture');

setupTestDB();

describe('Shop routes', () => {
  describe('POST /v1/shop', () => {
    test('should return 201 and successfully create new shop if data is ok', async () => {
      await insertUsers([userOne]);

      const res = await request(app)
        .post('/v1/shop')
        .set('Authorization', `Bearer ${userOneAccessToken}`)
        .send(createShop)
        .expect(httpStatus.CREATED);

      expect(res.body).not.toHaveProperty('user');
      expect(res.body).toEqual({
        id: expect.anything(),
        name: createShop.name,
        shopType: createShop.shopType.toHexString(),
      });

      const dbShop = await Shop.findById(res.body.id);
      expect(dbShop).toBeDefined();
      expect(dbShop).toMatchObject({
        name: createShop.name,
      });
    });

    test('should return 401 error if access token is missing', async () => {
      await request(app).post('/v1/users').send(createShop).expect(httpStatus.UNAUTHORIZED);
    });

    test('should return 400 error if name is missing', async () => {
      await insertUsers([userOne]);

      const newShop = {};

      await request(app)
        .post('/v1/shop')
        .set('Authorization', `Bearer ${userOneAccessToken}`)
        .send(newShop)
        .expect(httpStatus.BAD_REQUEST);
    });

    test('should return 400 error if name is invalid', async () => {
      await insertUsers([userOne]);

      const newShop = {
        name: '',
      };

      await request(app)
        .post('/v1/shop')
        .set('Authorization', `Bearer ${userOneAccessToken}`)
        .send(newShop)
        .expect(httpStatus.BAD_REQUEST);
    });
  });

  describe('GET /v1/shop', () => {
    test('should return 200 and apply the default query options', async () => {
      await insertUsers([userOne]);
      await insertShops([shopOne, shopTwo, shopThree], userOne);

      const res = await request(app)
        .get('/v1/shop')
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
        id: shopOne._id.toHexString(),
        name: shopOne.name,
      });
    });

    test('should return 401 error if access token is missing', async () => {
      await request(app).get('/v1/shop').send().expect(httpStatus.UNAUTHORIZED);
    });

    test('should only return the shop types of the user', async () => {
      await insertUsers([userOne, userTwo]);
      await insertShops([shopOne, shopTwo], userOne);
      await insertShops([shopThree], userTwo);

      const res = await request(app)
        .get('/v1/shop')
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

  describe('PATCH /v1/shop/:shopId', () => {
    test('should return 200 and successfully update shop', async () => {
      await insertUsers([userOne]);
      await insertShops([shopOne], userOne);

      const updateBody = {
        name: faker.name.findName(),
      };

      const res = await request(app)
        .patch(`/v1/shop/${shopOne._id}`)
        .set('Authorization', `Bearer ${userOneAccessToken}`)
        .send(updateBody)
        .expect(httpStatus.OK);

      expect(res.body).toEqual({
        id: shopOne._id.toHexString(),
        name: updateBody.name,
      });

      const shop = await Shop.find(shopOne._id);
      expect(shop).toBeDefined();
    });

    test('should return 401 error if access token is missing', async () => {
      await insertUsers([userOne]);
      await insertShops([shopOne], userOne);

      const updateBody = {
        name: faker.name.findName(),
      };

      await request(app).patch(`/v1/shop/${shopOne._id}`).send(updateBody).expect(httpStatus.UNAUTHORIZED);
    });

    test('should return 403 if user is updating shop of other user', async () => {
      await insertUsers([userOne, userTwo]);
      await insertShops([shopOne], userOne);
      await insertShops([shopTwo], userTwo);

      const updateBody = { name: faker.name.findName() };

      await request(app)
        .patch(`/v1/shop/${shopTwo._id}`)
        .set('Authorization', `Bearer ${userOneAccessToken}`)
        .send(updateBody)
        .expect(httpStatus.FORBIDDEN);
    });

    test('should return 404 if user is updating shop that is not found', async () => {
      await insertUsers([userOne]);
      const updateBody = { name: faker.name.findName() };

      await request(app)
        .patch(`/v1/shop/${shopOne._id}`)
        .set('Authorization', `Bearer ${userOneAccessToken}`)
        .send(updateBody)
        .expect(httpStatus.NOT_FOUND);
    });

    test('should return 400 error if userId is not a valid mongo id', async () => {
      await insertUsers([userOne]);
      const updateBody = { name: faker.name.findName() };

      await request(app)
        .patch(`/v1/shop/invalidId`)
        .set('Authorization', `Bearer ${userOneAccessToken}`)
        .send(updateBody)
        .expect(httpStatus.BAD_REQUEST);
    });
  });

  describe('DELETE /v1/shop/:shopId', () => {
    test('should return 204 if data is ok', async () => {
      await insertUsers([userOne]);
      await insertShops([shopOne], userOne);

      await request(app)
        .delete(`/v1/shop/${shopOne._id}`)
        .set('Authorization', `Bearer ${userOneAccessToken}`)
        .send()
        .expect(httpStatus.NO_CONTENT);

      const shop = await Shop.findById(shopOne._id);
      expect(shop).toBeNull();
    });

    test('should return 401 error if access token is missing', async () => {
      await insertUsers([userOne]);
      await insertShops([shopOne], userOne);

      await request(app).delete(`/v1/shop/${shopOne._id}`).send().expect(httpStatus.UNAUTHORIZED);
    });

    test('should return 403 if user is deleting shop of other user', async () => {
      await insertUsers([userOne, userTwo]);
      await insertShops([shopOne], userOne);
      await insertShops([shopTwo], userTwo);

      await request(app)
        .delete(`/v1/shop/${shopTwo._id}`)
        .set('Authorization', `Bearer ${userOneAccessToken}`)
        .send()
        .expect(httpStatus.FORBIDDEN);
    });

    test('should return 404 if user is deleting shop that is not found', async () => {
      await insertUsers([userOne]);

      await request(app)
        .delete(`/v1/shop/${shopOne._id}`)
        .set('Authorization', `Bearer ${userOneAccessToken}`)
        .send()
        .expect(httpStatus.NOT_FOUND);
    });

    test('should return 400 error if userId is not a valid mongo id', async () => {
      await insertUsers([userOne]);

      await request(app)
        .delete(`/v1/shop/invalidId`)
        .set('Authorization', `Bearer ${userOneAccessToken}`)
        .send()
        .expect(httpStatus.BAD_REQUEST);
    });
  });
});
