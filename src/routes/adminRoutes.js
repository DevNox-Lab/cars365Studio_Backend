const express = require('express');
const {
  getStats,
  getOrders,
  createOrder,
  updateOrder,
  updateOrderStatus,
  deleteOrder,
} = require('../controllers/adminController');

const router = express.Router();

router.get('/stats', getStats);
router.get('/orders', getOrders);
router.post('/orders', createOrder);
router.put('/orders/:id', updateOrder);
router.patch('/orders/:id/status', updateOrderStatus);
router.delete('/orders/:id', deleteOrder);

module.exports = router;
