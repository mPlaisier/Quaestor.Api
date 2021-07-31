const request = require('supertest');
const faker = require('faker');
const httpStatus = require('http-status');
const app = require('../../src/app');
const setupTestDB = require('../utils/setupTestDB');
const { LineItemCategory } = require('../../src/models');
const { userOne, userTwo, insertUsers } = require('../fixtures/user.fixture');
const { userOneAccessToken } = require('../fixtures/token.fixture');
const {
  lineItemCategoryOne,
  lineItemCategoryTwo,
  lineItemCategoryThree,
  insertLineItemCategories,
} = require('../fixtures/lineitemcategory.fixture');

const routePath = '/v1/lineitemcategory';

setupTestDB();

describe('LineItemCategory routes', () => {
  describe('POST /v1/lineitemcategory', () => {
    let newLineItemCategory;

    beforeEach(() => {
      newLineItemCategory = {
        name: faker.name.findName(),
      };
    });

    test('should return 201 and successfully create new lineItemCategory if data is ok', async () => {
      await insertUsers([userOne]);

      const res = await request(app)
        .post(routePath)
        .set('Authorization', `Bearer ${userOneAccessToken}`)
        .send(newLineItemCategory)
        .expect(httpStatus.CREATED);

      expect(res.body).not.toHaveProperty('user');
      expect(res.body).toEqual({
        id: expect.anything(),
        name: newLineItemCategory.name,
      });

      const dbLineItemCategory = await LineItemCategory.findById(res.body.id);
      expect(dbLineItemCategory).toBeDefined();
      expect(dbLineItemCategory).toMatchObject({
        name: newLineItemCategory.name,
      });
    });

    test('should return 401 error if access token is missing', async () => {
      await request(app).post('/v1/users').send(newLineItemCategory).expect(httpStatus.UNAUTHORIZED);
    });

    test('should return 400 error if name is missing', async () => {
      await insertUsers([userOne]);

      newLineItemCategory = {};

      await request(app)
        .post(routePath)
        .set('Authorization', `Bearer ${userOneAccessToken}`)
        .send(newLineItemCategory)
        .expect(httpStatus.BAD_REQUEST);
    });

    test('should return 400 error if name is invalid', async () => {
      await insertUsers([userOne]);

      newLineItemCategory = {
        name: '',
      };

      await request(app)
        .post(routePath)
        .set('Authorization', `Bearer ${userOneAccessToken}`)
        .send(newLineItemCategory)
        .expect(httpStatus.BAD_REQUEST);
    });
  });

  describe('GET /v1/lineitemcategory', () => {
    test('should return 200 and apply the default query options', async () => {
      await insertUsers([userOne]);
      await insertLineItemCategories([lineItemCategoryOne, lineItemCategoryTwo, lineItemCategoryThree], userOne);

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
        id: lineItemCategoryOne._id.toHexString(),
        name: lineItemCategoryOne.name,
      });
    });

    test('should return 401 error if access token is missing', async () => {
      await request(app).get(routePath).send().expect(httpStatus.UNAUTHORIZED);
    });

    test('should only return the line-item categories of the user', async () => {
      await insertUsers([userOne, userTwo]);
      await insertLineItemCategories([lineItemCategoryOne, lineItemCategoryTwo], userOne);
      await insertLineItemCategories([lineItemCategoryThree], userTwo);

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

  describe('PATCH /v1/lineitemcategory/:lineitemcategoryId', () => {
    test('should return 200 and successfully update lineItemCategory', async () => {
      await insertUsers([userOne]);
      await insertLineItemCategories([lineItemCategoryOne], userOne);

      const updateBody = {
        name: faker.name.findName(),
      };

      const res = await request(app)
        .patch(`${routePath}/${lineItemCategoryOne._id}`)
        .set('Authorization', `Bearer ${userOneAccessToken}`)
        .send(updateBody)
        .expect(httpStatus.OK);

      expect(res.body).toEqual({
        id: lineItemCategoryOne._id.toHexString(),
        name: updateBody.name,
      });

      const lineItemCategory = await LineItemCategory.find(lineItemCategoryOne._id);
      expect(lineItemCategory).toBeDefined();
    });

    test('should return 401 error if access token is missing', async () => {
      await insertUsers([userOne]);
      await insertLineItemCategories([lineItemCategoryOne], userOne);

      const updateBody = {
        name: faker.name.findName(),
      };

      await request(app).patch(`${routePath}/${lineItemCategoryOne._id}`).send(updateBody).expect(httpStatus.UNAUTHORIZED);
    });

    test('should return 403 if user is updating lineitemcategory of other user', async () => {
      await insertUsers([userOne, userTwo]);
      await insertLineItemCategories([lineItemCategoryOne], userOne);
      await insertLineItemCategories([lineItemCategoryTwo], userTwo);

      const updateBody = { name: faker.name.findName() };

      await request(app)
        .patch(`${routePath}/${lineItemCategoryTwo._id}`)
        .set('Authorization', `Bearer ${userOneAccessToken}`)
        .send(updateBody)
        .expect(httpStatus.FORBIDDEN);
    });

    test('should return 404 if user is updating lineitemcategory that is not found', async () => {
      await insertUsers([userOne]);
      const updateBody = { name: faker.name.findName() };

      await request(app)
        .patch(`${routePath}/${lineItemCategoryOne._id}`)
        .set('Authorization', `Bearer ${userOneAccessToken}`)
        .send(updateBody)
        .expect(httpStatus.NOT_FOUND);
    });

    test('should return 400 error if userId is not a valid mongo id', async () => {
      await insertUsers([userOne]);
      const updateBody = { name: faker.name.findName() };

      await request(app)
        .patch(`${routePath}/invalidId`)
        .set('Authorization', `Bearer ${userOneAccessToken}`)
        .send(updateBody)
        .expect(httpStatus.BAD_REQUEST);
    });
  });

  describe('DELETE /v1/lineitemcategory/:lineitemcategoryId', () => {
    test('should return 204 if data is ok', async () => {
      await insertUsers([userOne]);
      await insertLineItemCategories([lineItemCategoryOne], userOne);

      await request(app)
        .delete(`${routePath}/${lineItemCategoryOne._id}`)
        .set('Authorization', `Bearer ${userOneAccessToken}`)
        .send()
        .expect(httpStatus.NO_CONTENT);

      const lineItemCategory = await LineItemCategory.findById(lineItemCategoryOne._id);
      expect(lineItemCategory).toBeNull();
    });

    test('should return 401 error if access token is missing', async () => {
      await insertUsers([userOne]);
      await insertLineItemCategories([lineItemCategoryOne], userOne);

      await request(app).delete(`${routePath}/${lineItemCategoryOne._id}`).send().expect(httpStatus.UNAUTHORIZED);
    });

    test('should return 403 if user is deleting lineitemcategory of other user', async () => {
      await insertUsers([userOne, userTwo]);
      await insertLineItemCategories([lineItemCategoryOne], userOne);
      await insertLineItemCategories([lineItemCategoryTwo], userTwo);

      await request(app)
        .delete(`${routePath}/${lineItemCategoryTwo._id}`)
        .set('Authorization', `Bearer ${userOneAccessToken}`)
        .send()
        .expect(httpStatus.FORBIDDEN);
    });

    test('should return 404 if user is deleting lineitemcategory that is not found', async () => {
      await insertUsers([userOne]);

      await request(app)
        .delete(`${routePath}/${lineItemCategoryOne._id}`)
        .set('Authorization', `Bearer ${userOneAccessToken}`)
        .send()
        .expect(httpStatus.NOT_FOUND);
    });

    test('should return 400 error if userId is not a valid mongo id', async () => {
      await insertUsers([userOne]);

      await request(app)
        .delete(`${routePath}/invalidId`)
        .set('Authorization', `Bearer ${userOneAccessToken}`)
        .send()
        .expect(httpStatus.BAD_REQUEST);
    });
  });
});
