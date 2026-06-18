const Order = require('../models/Order');

const getStartOfWeek = () => {
  const now = new Date();
  const day = now.getDay();
  const diff = day === 0 ? 6 : day - 1;
  const start = new Date(now);
  start.setHours(0, 0, 0, 0);
  start.setDate(start.getDate() - diff);
  return start;
};

const getStartOfMonth = () => {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth(), 1);
};

const buildSearchFilter = (search = '') => {
  const trimmed = search.trim();
  if (!trimmed) {
    return {};
  }

  const regex = new RegExp(trimmed, 'i');

  return {
    $or: [
      { customerName: regex },
      { phoneNumber: regex },
      { 'vehicleInfo.model': regex },
      { 'vehicleInfo.carType': regex },
    ],
  };
};

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
 * Get a single order by ID
 * @param {string} id
 * @returns {Promise<Object>}
 */
const getOrderById = async (id) => {
  return await Order.findById(id);
};

/**
 * Get order stats for admin dashboard
 * @returns {Promise<Object>}
 */
const getOrderStats = async () => {
  const weekStart = getStartOfWeek();
  const monthStart = getStartOfMonth();

  const [weekOrders, monthOrders, revenueResult] = await Promise.all([
    Order.countDocuments({ createdAt: { $gte: weekStart } }),
    Order.countDocuments({ createdAt: { $gte: monthStart } }),
    Order.aggregate([
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: '$services.totalPrice' },
        },
      },
    ]),
  ]);

  return {
    weekOrders,
    monthOrders,
    totalRevenue: revenueResult[0]?.totalRevenue || 0,
  };
};

/**
 * Get paginated orders with optional search
 * @param {Object} options
 * @returns {Promise<Object>}
 */
const getOrdersPaginated = async ({ page = 1, limit = 10, search = '' }) => {
  const parsedPage = Math.max(parseInt(page, 10) || 1, 1);
  const parsedLimit = Math.min(Math.max(parseInt(limit, 10) || 10, 1), 100);
  const skip = (parsedPage - 1) * parsedLimit;
  const filter = buildSearchFilter(search);

  const [orders, total] = await Promise.all([
    Order.find(filter).sort({ createdAt: -1 }).skip(skip).limit(parsedLimit),
    Order.countDocuments(filter),
  ]);

  return {
    data: orders,
    pagination: {
      page: parsedPage,
      limit: parsedLimit,
      total,
      totalPages: Math.ceil(total / parsedLimit) || 1,
    },
  };
};

module.exports = {
  createOrder,
  getOrderById,
  getOrderStats,
  getOrdersPaginated,
};
