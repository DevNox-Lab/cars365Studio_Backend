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
 * Get paginated order records
 * @param {number} page
 * @param {number} limit
 * @returns {Promise<{ count: number, page: number, limit: number, totalPages: number, data: Array }>}
 */
const getOrdersPaginated = async (page = 1, limit = 10) => {
  const parsedPage = Math.max(1, parseInt(page, 10) || 1);
  const parsedLimit = Math.max(1, parseInt(limit, 10) || 10);
  const skip = (parsedPage - 1) * parsedLimit;

  const [data, count] = await Promise.all([
    Order.find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parsedLimit),
    Order.countDocuments()
  ]);

  const totalPages = Math.ceil(count / parsedLimit) || 1;

  return {
    count,
    page: parsedPage,
    limit: parsedLimit,
    totalPages,
    data
  };
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
  getOrdersPaginated,
  getOrderById
};
