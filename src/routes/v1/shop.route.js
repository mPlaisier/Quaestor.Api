const express = require('express');
const auth = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const shopValidation = require('../../validations/shop.validation');
const shopController = require('../../controllers/shop.controller');

const router = express.Router();

router
  .route('/')
  .get(auth(), validate(shopValidation.getShops), shopController.getShops)
  .post(auth(), validate(shopValidation.createShop), shopController.createShop);

router
  .route('/:shopId')
  .patch(auth(), validate(shopValidation.updateShop), shopController.getShop, shopController.updateShop)
  .delete(auth(), validate(shopValidation.deleteShop), shopController.getShop, shopController.deleteShop);

module.exports = router;
