const request = require('supertest');
const httpStatus = require('http-status');
const mongoose = require('mongoose');
const app = require('../../src/app');
const setupTestDB = require('../utils/setupTestDB');
const { LineContainer } = require('../../src/models');
const { userOne, userTwo, insertUsers } = require('../fixtures/user.fixture');
const { userOneAccessToken, userTwoAccessToken } = require('../fixtures/token.fixture');
const {
  lineContainerOne,
  lineContainerTwo,
  lineContainerThree,
  insertLineContainers,
} = require('../fixtures/lineContainer.fixture');

const routePath = '/v1/linecontainer';

setupTestDB();

describe('Line container routes', () => {
  describe('POST /v1/lineContainer', () => {
    test('should return 201 and successfully create new line container if data is ok', async () => {
      await insertUsers([userOne]);

      const res = await request(app)
        .post(routePath)
        .set('Authorization', `Bearer ${userOneAccessToken}`)
        .send(lineContainerOne)
        .expect(httpStatus.CREATED);

      expect(res.body).not.toHaveProperty('user');

      const dbLineContainer = await LineContainer.findById(res.body.id);
      expect(dbLineContainer).toBeDefined();
    });

    test('should return 401 error if access token is missing', async () => {
      await request(app).post(routePath).send(lineContainerOne).expect(httpStatus.UNAUTHORIZED);
    });

    test('should return 400 error if data is missing', async () => {
      await insertUsers([userOne]);

      const newLineContainer = {};

      await request(app)
        .post(routePath)
        .set('Authorization', `Bearer ${userOneAccessToken}`)
        .send(newLineContainer)
        .expect(httpStatus.BAD_REQUEST);
    });
  });

  describe('GET /v1/lineContainer?month=M&year=YYYY', () => {
    test('should return 200 and apply the default query options', async () => {
      await insertUsers([userOne]);
      await insertLineContainers([lineContainerOne], userOne);

      const res = await request(app)
        .get(`${routePath}?month=${lineContainerOne.month}&year=${lineContainerOne.year}`)
        .set('Authorization', `Bearer ${userOneAccessToken}`)
        .send()
        .expect(httpStatus.OK);

      expect(res.body).toEqual({
        results: expect.any(Array),
        hasNextPage: false,
        hasPrevPage: false,
        limit: 10,
        nextPage: null,
        offset: 0,
        page: 1,
        pagingCounter: 1,
        prevPage: null,
        totalPages: 1,
        totalResults: 1,
      });
      expect(res.body.results).toHaveLength(1);
    });

    test('should return 401 error if access token is missing', async () => {
      await request(app).get(routePath).send().expect(httpStatus.UNAUTHORIZED);
    });

    test('should only return the line container of the user', async () => {
      await insertUsers([userOne, userTwo]);
      await insertLineContainers([lineContainerOne, lineContainerTwo], userOne);
      await insertLineContainers([lineContainerThree], userTwo);

      const res = await request(app)
        .get(`${routePath}?month=${lineContainerOne.month}&year=${lineContainerOne.year}`)
        .set('Authorization', `Bearer ${userOneAccessToken}`)
        .send()
        .expect(httpStatus.OK);

      expect(res.body).toEqual({
        results: expect.any(Array),
        hasNextPage: false,
        hasPrevPage: false,
        limit: 10,
        nextPage: null,
        offset: 0,
        page: 1,
        pagingCounter: 1,
        prevPage: null,
        totalPages: 1,
        totalResults: 2,
      });
      expect(res.body.results).toHaveLength(2);
    });
  });

  describe('PATCH /v1/lineContainer/:lineContainerId', () => {
    test('should return 200 and successfully update lineContainer', async () => {
      await insertUsers([userOne]);
      await insertLineContainers([lineContainerOne], userOne);

      const updateBody = {
        shop: mongoose.Types.ObjectId(),
      };

      const containers = await request(app)
        .get(`${routePath}?month=${lineContainerOne.month}&year=${lineContainerOne.year}`)
        .set('Authorization', `Bearer ${userOneAccessToken}`)
        .send()
        .expect(httpStatus.OK);
      const containerOne = containers.body.results[0];

      await request(app)
        .patch(`${routePath}/${containerOne.id}`)
        .set('Authorization', `Bearer ${userOneAccessToken}`)
        .send(updateBody)
        .expect(httpStatus.OK);

      const lineContainer = await LineContainer.find(containerOne._id);
      expect(lineContainer).toBeDefined();
    });

    test('should return 401 error if access token is missing', async () => {
      await insertUsers([userOne]);
      await insertLineContainers([lineContainerOne], userOne);

      const updateBody = {
        shop: mongoose.Types.ObjectId(),
      };

      const containers = await request(app)
        .get(`${routePath}?month=${lineContainerOne.month}&year=${lineContainerOne.year}`)
        .set('Authorization', `Bearer ${userOneAccessToken}`)
        .send()
        .expect(httpStatus.OK);
      const containerOne = containers.body.results[0];

      await request(app).patch(`${routePath}/${containerOne.id}`).send(updateBody).expect(httpStatus.UNAUTHORIZED);
    });

    test('should return 403 if user is updating line container of other user', async () => {
      await insertUsers([userOne, userTwo]);
      await insertLineContainers([lineContainerOne], userOne);
      await insertLineContainers([lineContainerTwo], userTwo);

      const updateBody = {
        shop: mongoose.Types.ObjectId(),
      };

      const containers = await request(app)
        .get(`${routePath}?month=${lineContainerOne.month}&year=${lineContainerOne.year}`)
        .set('Authorization', `Bearer ${userOneAccessToken}`)
        .send()
        .expect(httpStatus.OK);
      const containerOne = containers.body.results[0];

      await request(app)
        .patch(`${routePath}/${containerOne.id}`)
        .set('Authorization', `Bearer ${userTwoAccessToken}`)
        .send(updateBody)
        .expect(httpStatus.FORBIDDEN);
    });

    test('should return 404 if user is updating line container that is not found', async () => {
      await insertUsers([userOne]);

      const updateBody = {
        shop: mongoose.Types.ObjectId(),
      };

      await request(app)
        .patch(`${routePath}/${mongoose.Types.ObjectId()}`)
        .set('Authorization', `Bearer ${userOneAccessToken}`)
        .send(updateBody)
        .expect(httpStatus.NOT_FOUND);
    });

    test('should return 400 error if userId is not a valid mongo id', async () => {
      await insertUsers([userOne]);

      const updateBody = {
        shop: mongoose.Types.ObjectId(),
      };

      await request(app)
        .patch(`${routePath}/invalidId`)
        .set('Authorization', `Bearer ${userOneAccessToken}`)
        .send(updateBody)
        .expect(httpStatus.BAD_REQUEST);
    });
  });

  describe('DELETE /v1/lineContainer/:lineContainerId', () => {
    test('should return 204 if data is ok', async () => {
      await insertUsers([userOne]);
      await insertLineContainers([lineContainerOne], userOne);

      const containers = await request(app)
        .get(`${routePath}?month=${lineContainerOne.month}&year=${lineContainerOne.year}`)
        .set('Authorization', `Bearer ${userOneAccessToken}`)
        .send()
        .expect(httpStatus.OK);
      const containerOne = containers.body.results[0];

      await request(app)
        .delete(`${routePath}/${containerOne.id}`)
        .set('Authorization', `Bearer ${userOneAccessToken}`)
        .send()
        .expect(httpStatus.NO_CONTENT);

      const lineContainer = await LineContainer.findById(containerOne.id);
      expect(lineContainer).toBeNull();
    });

    test('should return 401 error if access token is missing', async () => {
      await insertUsers([userOne]);
      await insertLineContainers([lineContainerOne], userOne);

      const containers = await request(app)
        .get(`${routePath}?month=${lineContainerOne.month}&year=${lineContainerOne.year}`)
        .set('Authorization', `Bearer ${userOneAccessToken}`)
        .send()
        .expect(httpStatus.OK);
      const containerOne = containers.body.results[0];

      await request(app).delete(`${routePath}/${containerOne.id}`).send().expect(httpStatus.UNAUTHORIZED);
    });

    test('should return 403 if user is deleting lineitemcategory of other user', async () => {
      await insertUsers([userOne, userTwo]);
      await insertLineContainers([lineContainerOne], userOne);
      await insertLineContainers([lineContainerTwo], userTwo);

      const containers = await request(app)
        .get(`${routePath}?month=${lineContainerOne.month}&year=${lineContainerOne.year}`)
        .set('Authorization', `Bearer ${userOneAccessToken}`)
        .send()
        .expect(httpStatus.OK);
      const containerOne = containers.body.results[0];

      await request(app)
        .delete(`${routePath}/${containerOne.id}`)
        .set('Authorization', `Bearer ${userTwoAccessToken}`)
        .send()
        .expect(httpStatus.FORBIDDEN);
    });

    test('should return 404 if user is deleting lineitemcategory that is not found', async () => {
      await insertUsers([userOne]);

      await request(app)
        .delete(`${routePath}/${mongoose.Types.ObjectId()}`)
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
