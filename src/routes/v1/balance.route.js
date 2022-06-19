const express = require('express');
const auth = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const balanceValidation = require('../../validations/balance.validation');
const balanceController = require('../../controllers/balance.controller');

const router = express.Router();

router
  .route('/')
  .get(auth(), validate(balanceValidation.getBalances), balanceController.getBalances)
  .post(auth(), validate(balanceValidation.createBalance), balanceController.createBalance);

router
  .route('/:balanceId')
  .patch(auth(), validate(balanceValidation.updateBalance), balanceController.getBalance, balanceController.updateBalance)
  .delete(auth(), validate(balanceValidation.deleteBalance), balanceController.getBalance, balanceController.deleteBalance);

module.exports = router;

/**
 * @swagger
 * tags:
 *   name: Balance
 *   description: Balance management and retrieval
 */

/**
 * @swagger
 * /balance:
 *   post:
 *     summary: Create a balance
 *     tags: [Balance]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - month
 *               - year
 *               - amount
 *               - account
 *             properties:
 *               month:
 *                 type: number
 *               year:
 *                 type: number
 *             example:
 *               month: 6
 *               year: 2022
 *               amount: 3000.00
 *               account: 610fac49091cbeb604285c9f
 *     responses:
 *       "201":
 *         description: Created
 *         content:
 *           application/json:
 *             schema:
 *                $ref: '#/components/schemas/Balance'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 *
 *   get:
 *     summary: Get all balances for a month and year
 *     tags: [Balance]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: month
 *         required: true
 *         schema:
 *           type: number
 *         description: Month to retrieve the balances
 *       - in: query
 *         name: year
 *         required: true
 *         schema:
 *           type: number
 *         description: Year to retrieve the balances
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
 *         description: Maximum number of balances
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
 *                     $ref: '#/components/schemas/Balance'
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
 * /balance/{id}:
 *   patch:
 *     summary: Update a balance
 *     description: Change a value in balance.
 *     tags: [Balance]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Balance id
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *             example:
 *               month: 6
 *               year: 2022
 *               amount: 3000.00
 *               account: 610fac49091cbeb604285c9f
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *                $ref: '#/components/schemas/Balance'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 *       "404":
 *         $ref: '#/components/responses/NotFound'
 *
 *   delete:
 *     summary: Delete a balance
 *     tags: [Balance]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Balance id
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
