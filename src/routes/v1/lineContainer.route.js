const express = require('express');
const auth = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const lineContainerValidation = require('../../validations/lineContainer.validation');
const lineContainerController = require('../../controllers/lineContainer.controller');

const router = express.Router();

router
  .route('/')
  .get(auth(), validate(lineContainerValidation.getLineContainers), lineContainerController.getLineContainers)
  .post(auth(), validate(lineContainerValidation.createLineContainer), lineContainerController.createLineContainer);

router
  .route('/:lineContainerId')
  .patch(
    auth(),
    validate(lineContainerValidation.updateLineContainer),
    lineContainerController.getLineContainer,
    lineContainerController.updateLineContainer
  )
  .delete(
    auth(),
    validate(lineContainerValidation.deleteLineContainer),
    lineContainerController.getLineContainer,
    lineContainerController.deleteLineContainer
  );

module.exports = router;

/**
 * @swagger
 * tags:
 *   name: Line container
 *   description: An individual entry of a purchase or payment
 */
