const Order = require('../models/Order');

/**
 * Create a new order record
 * @param {Object} orderData 
 * @returns {Promise<Object>}
 */
const createOrder = async (orderData) => {
  const order = new Order(orderData);
  return await order.save();
};

/**
 * Get all order records
 * @returns {Promise<Array>}
 */
const getAllOrders = async () => {
  return await Order.find().sort({ createdAt: -1 });
};

/**
 * Get a single order by ID
 * @param {string} id 
 * @returns {Promise<Object>}
 */
const getOrderById = async (id) => {
  return await Order.findById(id);
};

module.exports = {
  createOrder,
  getAllOrders,
  getOrderById
};
