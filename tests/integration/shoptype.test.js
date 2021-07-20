const request = require('supertest');
const faker = require('faker');
const httpStatus = require('http-status');
const app = require('../../src/app');
const setupTestDB = require('../utils/setupTestDB');
const { ShopType } = require('../../src/models');
const { userOne, userTwo, insertUsers } = require('../fixtures/user.fixture');
const { userOneAccessToken } = require('../fixtures/token.fixture');
const { shopTypeOne, shopTypeTwo, shopTypeThree, insertShopTypes } = require('../fixtures/shoptype.fixture');

setupTestDB();

describe('ShopType routes', () => {
  describe('POST /v1/shoptype', () => {
    let newShopType;

    beforeEach(() => {
      newShopType = {
        name: faker.name.findName(),
      };
    });

    test('should return 201 and successfully create new shopType if data is ok', async () => {
      await insertUsers([userOne]);

      const res = await request(app)
        .post('/v1/shoptype')
        .set('Authorization', `Bearer ${userOneAccessToken}`)
        .send(newShopType)
        .expect(httpStatus.CREATED);

      expect(res.body).not.toHaveProperty('user');
      expect(res.body).toEqual({
        id: expect.anything(),
        name: newShopType.name,
      });

      const dbShopType = await ShopType.findById(res.body.id);
      expect(dbShopType).toBeDefined();
      expect(dbShopType).toMatchObject({
        name: newShopType.name,
      });
    });

    test('should return 401 error if access token is missing', async () => {
      await request(app).post('/v1/users').send(newShopType).expect(httpStatus.UNAUTHORIZED);
    });

    test('should return 400 error if name is missing', async () => {
      await insertUsers([userOne]);

      newShopType = {};

      await request(app)
        .post('/v1/shoptype')
        .set('Authorization', `Bearer ${userOneAccessToken}`)
        .send(newShopType)
        .expect(httpStatus.BAD_REQUEST);
    });

    test('should return 400 error if name is invalid', async () => {
      await insertUsers([userOne]);

      newShopType = {
        name: '',
      };

      await request(app)
        .post('/v1/shoptype')
        .set('Authorization', `Bearer ${userOneAccessToken}`)
        .send(newShopType)
        .expect(httpStatus.BAD_REQUEST);
    });
  });

  describe('GET /v1/shoptype', () => {
    test('should return 200 and apply the default query options', async () => {
      await insertUsers([userOne]);
      await insertShopTypes([shopTypeOne, shopTypeTwo, shopTypeThree], userOne);

      const res = await request(app)
        .get('/v1/shoptype')
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
        id: shopTypeOne._id.toHexString(),
        name: shopTypeOne.name,
      });
    });

    test('should return 401 error if access token is missing', async () => {
      await request(app).get('/v1/shoptype').send().expect(httpStatus.UNAUTHORIZED);
    });

    test('should only return the shop types of the user', async () => {
      await insertUsers([userOne, userTwo]);
      await insertShopTypes([shopTypeOne, shopTypeTwo], userOne);
      await insertShopTypes([shopTypeThree], userTwo);

      const res = await request(app)
        .get('/v1/shoptype')
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

  describe('PATCH /v1/shoptype/:shoptypeId', () => {
    test('should return 200 and successfully update shopType', async () => {
      await insertUsers([userOne]);
      await insertShopTypes([shopTypeOne], userOne);

      const updateBody = {
        name: faker.name.findName(),
      };

      const res = await request(app)
        .patch(`/v1/shoptype/${shopTypeOne._id}`)
        .set('Authorization', `Bearer ${userOneAccessToken}`)
        .send(updateBody)
        .expect(httpStatus.OK);

      expect(res.body).toEqual({
        id: shopTypeOne._id.toHexString(),
        name: updateBody.name,
      });

      const shopType = await ShopType.find(shopTypeOne._id);
      expect(shopType).toBeDefined();
    });

    test('should return 401 error if access token is missing', async () => {
      await insertUsers([userOne]);
      await insertShopTypes([shopTypeOne], userOne);

      const updateBody = {
        name: faker.name.findName(),
      };

      await request(app).patch(`/v1/shoptype/${shopTypeOne._id}`).send(updateBody).expect(httpStatus.UNAUTHORIZED);
    });

    test('should return 403 if user is updating shoptype of other user', async () => {
      await insertUsers([userOne, userTwo]);
      await insertShopTypes([shopTypeOne], userOne);
      await insertShopTypes([shopTypeTwo], userTwo);

      const updateBody = { name: faker.name.findName() };

      await request(app)
        .patch(`/v1/shoptype/${shopTypeTwo._id}`)
        .set('Authorization', `Bearer ${userOneAccessToken}`)
        .send(updateBody)
        .expect(httpStatus.FORBIDDEN);
    });

    test('should return 404 if user is updating shoptype that is not found', async () => {
      await insertUsers([userOne]);
      const updateBody = { name: faker.name.findName() };

      await request(app)
        .patch(`/v1/shoptype/${shopTypeOne._id}`)
        .set('Authorization', `Bearer ${userOneAccessToken}`)
        .send(updateBody)
        .expect(httpStatus.NOT_FOUND);
    });

    test('should return 400 error if userId is not a valid mongo id', async () => {
      await insertUsers([userOne]);
      const updateBody = { name: faker.name.findName() };

      await request(app)
        .patch(`/v1/shoptype/invalidId`)
        .set('Authorization', `Bearer ${userOneAccessToken}`)
        .send(updateBody)
        .expect(httpStatus.BAD_REQUEST);
    });
  });

  describe('DELETE /v1/shoptype/:shoptypeId', () => {
    test('should return 204 if data is ok', async () => {
      await insertUsers([userOne]);
      await insertShopTypes([shopTypeOne], userOne);

      await request(app)
        .delete(`/v1/shoptype/${shopTypeOne._id}`)
        .set('Authorization', `Bearer ${userOneAccessToken}`)
        .send()
        .expect(httpStatus.NO_CONTENT);

      const shopType = await ShopType.findById(shopTypeOne._id);
      expect(shopType).toBeNull();
    });

    test('should return 401 error if access token is missing', async () => {
      await insertUsers([userOne]);
      await insertShopTypes([shopTypeOne], userOne);

      await request(app).delete(`/v1/shoptype/${shopTypeOne._id}`).send().expect(httpStatus.UNAUTHORIZED);
    });

    test('should return 403 if user is deleting shoptype of other user', async () => {
      await insertUsers([userOne, userTwo]);
      await insertShopTypes([shopTypeOne], userOne);
      await insertShopTypes([shopTypeTwo], userTwo);

      await request(app)
        .delete(`/v1/shoptype/${shopTypeTwo._id}`)
        .set('Authorization', `Bearer ${userOneAccessToken}`)
        .send()
        .expect(httpStatus.FORBIDDEN);
    });

    test('should return 404 if user is deleting shoptype that is not found', async () => {
      await insertUsers([userOne]);

      await request(app)
        .delete(`/v1/shoptype/${shopTypeOne._id}`)
        .set('Authorization', `Bearer ${userOneAccessToken}`)
        .send()
        .expect(httpStatus.NOT_FOUND);
    });

    test('should return 400 error if userId is not a valid mongo id', async () => {
      await insertUsers([userOne]);

      await request(app)
        .delete(`/v1/shoptype/invalidId`)
        .set('Authorization', `Bearer ${userOneAccessToken}`)
        .send()
        .expect(httpStatus.BAD_REQUEST);
    });
  });
});
