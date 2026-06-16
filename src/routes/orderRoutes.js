const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const { createOrder, getOrders, getOrderById } = require('../controllers/orderController');

router.route('/')
  .get(authMiddleware, getOrders)
  .post(createOrder);

router.route('/:id')
  .get(authMiddleware, getOrderById);

module.exports = router;
