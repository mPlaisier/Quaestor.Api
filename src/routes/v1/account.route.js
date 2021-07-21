const express = require('express');
const auth = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const accountValidation = require('../../validations/account.validation');
const accountController = require('../../controllers/account.controller');

const router = express.Router();

router
  .route('/')
  .get(auth(), validate(accountValidation.getAccounts), accountController.getAccounts)
  .post(auth(), validate(accountValidation.createAccount), accountController.createAccount);

router
  .route('/:accountId')
  .patch(auth(), validate(accountValidation.updateAccount), accountController.getAccount, accountController.updateAccount)
  .delete(auth(), validate(accountValidation.deleteAccount), accountController.getAccount, accountController.deleteAccount);

module.exports = router;

/**
 * @swagger
 * tags:
 *   name: Account
 *   description: Accounts to log financial data
 */

/**
 * @swagger
 * /account:
 *   post:
 *     summary: Create an account
 *     tags: [Account]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - accountType
 *               - isDefault
 *             properties:
 *               name:
 *                 type: string
 *               accountType:
 *                  type: string
 *                  enum: [Bank, Mealvouchers, Cash, Savings, Investment]
 *               isDefault:
 *                 type: boolean
 *                 default: false
 *             example:
 *               name: fake name
 *               accountType: Bank
 *               isDefault: true
 *     responses:
 *       "201":
 *         description: Created
 *         content:
 *           application/json:
 *             schema:
 *                $ref: '#/components/schemas/Account'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 *
 *   get:
 *     summary: Get all accounts
 *     tags: [Account]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *         description: sort by query in the form of field:desc/asc (ex. name:asc)
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *         default: 10
 *         description: Maximum number of users
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *         description: Page number
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 results:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Account'
 *                 page:
 *                   type: integer
 *                   example: 1
 *                 limit:
 *                   type: integer
 *                   example: 10
 *                 totalPages:
 *                   type: integer
 *                   example: 1
 *                 totalResults:
 *                   type: integer
 *                   example: 1
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 */

/**
 * @swagger
 * /account/{id}:
 *   patch:
 *     summary: Update an account
 *     description: Change a value of an account.
 *     tags: [Account]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Account id
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               accountType:
 *                  type: string
 *                  enum: [Bank, Mealvouchers, Cash, Savings, Investment]
 *               isDefault:
 *                 type: boolean
 *                 default: false
 *             example:
 *               name: updated name
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *                $ref: '#/components/schemas/Account'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 *       "404":
 *         $ref: '#/components/responses/NotFound'
 *
 *   delete:
 *     summary: Delete an account
 *     tags: [Account]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Account id
 *     responses:
 *       "200":
 *         description: No content
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 *       "404":
 *         $ref: '#/components/responses/NotFound'
 */
