const request = require('supertest');
const faker = require('faker');
const httpStatus = require('http-status');
const app = require('../../src/app');

const setupTestDB = require('../utils/setupTestDB');

const { Goal } = require('../../src/models');
const { userOne, userTwo, insertUsers } = require('../fixtures/user.fixture');
const { userOneAccessToken } = require('../fixtures/token.fixture');
const {
  createGoal,
  createGoalAmountSaved,
  createGoalAmountReached,
  goalOne,
  goalTwo,
  goalThree,
  goalWithoutName,
  goalInvalidGoalType,
  insertGoals,
} = require('../fixtures/goal.fixture');

const routePath = '/v1/goal';

setupTestDB();

describe('Goals routes', () => {
  describe('POST /v1/goal', () => {
    test('should return 201 and successfully create new goal if data is ok', async () => {
      await insertUsers([userOne]);

      const res = await request(app)
        .post(routePath)
        .set('Authorization', `Bearer ${userOneAccessToken}`)
        .send(createGoal)
        .expect(httpStatus.CREATED);

      expect(res.body).not.toHaveProperty('user');
      expect(res.body).toMatchObject({
        id: expect.anything(),
        name: createGoal.name,
        description: createGoal.description,
        amount: createGoal.amount,
        goalType: createGoal.goalType,
      });

      const dbGoal = await Goal.findById(res.body.id);
      expect(dbGoal).toBeDefined();
      expect(dbGoal).toMatchObject({
        name: createGoal.name,
        description: createGoal.description,
        amount: createGoal.amount,
        goalType: createGoal.goalType,
      });
    });

    test('should return 401 error if access token is missing', async () => {
      await request(app).post(routePath).send(createGoal).expect(httpStatus.UNAUTHORIZED);
    });

    test('should return 400 error if all required properties are missing', async () => {
      await insertUsers([userOne]);

      const emptyGoal = {};

      await request(app)
        .post(routePath)
        .set('Authorization', `Bearer ${userOneAccessToken}`)
        .send(emptyGoal)
        .expect(httpStatus.BAD_REQUEST);
    });

    test('should return 400 error if name is missing', async () => {
      await insertUsers([userOne]);

      await request(app)
        .post(routePath)
        .set('Authorization', `Bearer ${userOneAccessToken}`)
        .send(goalWithoutName)
        .expect(httpStatus.BAD_REQUEST);
    });

    test('should return 400 error if goal type is invalid', async () => {
      await insertUsers([userOne]);

      await request(app)
        .post(routePath)
        .set('Authorization', `Bearer ${userOneAccessToken}`)
        .send(goalInvalidGoalType)
        .expect(httpStatus.BAD_REQUEST);
    });
  });

  describe('GET /v1/goal', () => {
    test('should return 200 and apply the default query options', async () => {
      await insertUsers([userOne]);
      await insertGoals([goalOne, goalTwo, goalThree], userOne);

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
      expect(res.body.results[0]).toMatchObject({
        id: goalOne._id.toHexString(),
        name: goalOne.name,
        description: goalOne.description,
        amount: goalOne.amount,
        goalType: goalOne.goalType,
      });
    });

    test('should return 401 error if access token is missing', async () => {
      await request(app).get(routePath).send().expect(httpStatus.UNAUTHORIZED);
    });

    test('should only return the goals of the user', async () => {
      await insertUsers([userOne, userTwo]);
      await insertGoals([goalOne, goalTwo], userOne);
      await insertGoals([goalThree], userTwo);

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

  describe('GET /v1/goal?=params', () => {
    test('should only return goals with goal type AmountSaved', async () => {
      await insertUsers([userOne]);
      await insertGoals([createGoalAmountSaved, createGoalAmountReached], userOne);

      const res = await request(app)
        .get(`${routePath}?goalType=AmountSaved`)
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

      expect(res.body.results[0]).toMatchObject({
        id: createGoalAmountSaved._id.toHexString(),
        name: createGoalAmountSaved.name,
        description: createGoalAmountSaved.description,
        amount: createGoalAmountSaved.amount,
        goalType: createGoalAmountSaved.goalType,
      });
    });

    test('should only return goals with goal type AmountReached', async () => {
      await insertUsers([userOne]);
      await insertGoals([createGoalAmountSaved, createGoalAmountReached], userOne);

      const res = await request(app)
        .get(`${routePath}?goalType=AmountReached`)
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

      expect(res.body.results[0]).toMatchObject({
        id: createGoalAmountReached._id.toHexString(),
        name: createGoalAmountReached.name,
        description: createGoalAmountReached.description,
        amount: createGoalAmountReached.amount,
        goalType: createGoalAmountReached.goalType,
      });
    });
  });

  describe('PATCH /v1/goal/:goalId', () => {
    let updateGoal;

    beforeEach(() => {
      updateGoal = {
        name: faker.name.findName(),
      };
    });

    test('should return 200 and successfully update goal', async () => {
      await insertUsers([userOne]);
      await insertGoals([goalOne], userOne);

      const res = await request(app)
        .patch(`${routePath}/${goalOne._id}`)
        .set('Authorization', `Bearer ${userOneAccessToken}`)
        .send(updateGoal)
        .expect(httpStatus.OK);

      expect(res.body).toMatchObject({
        id: goalOne._id.toHexString(),
        name: updateGoal.name,
        description: goalOne.description,
        amount: goalOne.amount,
        goalType: goalOne.goalType,
      });

      const result = await Goal.find(goalOne._id);
      expect(result).toBeDefined();
    });

    test('should return 401 error if access token is missing', async () => {
      await insertUsers([userOne]);
      await insertGoals([goalOne], userOne);

      await request(app).patch(`${routePath}/${goalOne._id}`).send(updateGoal).expect(httpStatus.UNAUTHORIZED);
    });

    test('should return 403 if user is updating goal of other user', async () => {
      await insertUsers([userOne, userTwo]);
      await insertGoals([goalOne], userOne);
      await insertGoals([goalTwo], userTwo);

      await request(app)
        .patch(`${routePath}/${goalTwo._id}`)
        .set('Authorization', `Bearer ${userOneAccessToken}`)
        .send(updateGoal)
        .expect(httpStatus.FORBIDDEN);
    });

    test('should return 404 if user is updating goal that is not found', async () => {
      await insertUsers([userOne]);

      await request(app)
        .patch(`${routePath}/${goalOne._id}`)
        .set('Authorization', `Bearer ${userOneAccessToken}`)
        .send(updateGoal)
        .expect(httpStatus.NOT_FOUND);
    });

    test('should return 400 error if goalId is not a valid mongo id', async () => {
      await insertUsers([userOne]);

      await request(app)
        .patch(`${routePath}/invalid`)
        .set('Authorization', `Bearer ${userOneAccessToken}`)
        .send(updateGoal)
        .expect(httpStatus.BAD_REQUEST);
    });
  });

  describe('DELETE /v1/goal/:goalId', () => {
    test('should return 204 if data is ok', async () => {
      await insertUsers([userOne]);
      await insertGoals([goalOne], userOne);

      await request(app)
        .delete(`${routePath}/${goalOne._id}`)
        .set('Authorization', `Bearer ${userOneAccessToken}`)
        .send()
        .expect(httpStatus.NO_CONTENT);

      const goal = await Goal.findById(goalOne._id);
      expect(goal).toBeNull();
    });

    test('should return 401 error if access token is missing', async () => {
      await insertUsers([userOne]);
      await insertGoals([goalOne], userOne);

      await request(app).delete(`${routePath}/${goalOne._id}`).send().expect(httpStatus.UNAUTHORIZED);
    });

    test('should return 403 if user is deleting goal of other user', async () => {
      await insertUsers([userOne, userTwo]);
      await insertGoals([goalOne], userOne);
      await insertGoals([goalTwo], userTwo);

      await request(app)
        .delete(`${routePath}/${goalTwo._id}`)
        .set('Authorization', `Bearer ${userOneAccessToken}`)
        .send()
        .expect(httpStatus.FORBIDDEN);
    });

    test('should return 404 if user is deleting goal that is not found', async () => {
      await insertUsers([userOne]);

      await request(app)
        .delete(`${routePath}/${goalOne._id}`)
        .set('Authorization', `Bearer ${userOneAccessToken}`)
        .send()
        .expect(httpStatus.NOT_FOUND);
    });

    test('should return 400 error if goalId is not a valid mongo id', async () => {
      await insertUsers([userOne]);

      await request(app)
        .delete(`${routePath}/invalid`)
        .set('Authorization', `Bearer ${userOneAccessToken}`)
        .send()
        .expect(httpStatus.BAD_REQUEST);
    });
  });
});
