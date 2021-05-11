const express = require('express');
const auth = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const shopTypeValidation = require('../../validations/shoptype.validation');
const shopTypeController = require('../../controllers/shoptype.controller');

const router = express.Router();

router
  .route('/')
  .get(auth(), validate(shopTypeValidation.getShopTypes), shopTypeController.getShopTypes)
  .post(auth(), validate(shopTypeValidation.createShopType), shopTypeController.createShopType);

router
  .route('/:shopId')
  .patch(
    auth(),
    validate(shopTypeValidation.updateShopType),
    shopTypeController.getShopType,
    shopTypeController.updateShopType
  )
  .delete(
    auth(),
    validate(shopTypeValidation.deleteShopType),
    shopTypeController.getShopType,
    shopTypeController.deleteShopType
  );

module.exports = router;
