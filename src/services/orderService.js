const Order = require('../models/Order');
const { ORDER_STATUSES } = require('../models/Order');

const getStartOfDay = (date = new Date()) => {
  const start = new Date(date);
  start.setHours(0, 0, 0, 0);
  return start;
};

const getStartOfWeek = (date = new Date()) => {
  const start = getStartOfDay(date);
  const day = start.getDay();
  const diff = day === 0 ? 6 : day - 1;
  start.setDate(start.getDate() - diff);
  return start;
};

const getStartOfMonth = (date = new Date()) => {
  const start = getStartOfDay(date);
  return new Date(start.getFullYear(), start.getMonth(), 1);
};

const getEndOfDay = (date = new Date()) => {
  const end = new Date(date);
  end.setHours(23, 59, 59, 999);
  return end;
};

const buildSearchFilter = (search = '') => {
  const trimmed = search.trim();
  if (!trimmed) return {};

  const regex = new RegExp(trimmed.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i');

  return {
    $or: [
      { customerName: regex },
      { phoneNumber: regex },
      { orderNumber: regex },
      { 'vehicleInfo.model': regex },
      { 'vehicleInfo.carType': regex },
      { address: regex },
      { notes: regex },
    ],
  };
};

const buildDateFilter = ({ dateFrom, dateTo, frequency }) => {
  const filter = {};

  if (dateFrom || dateTo) {
    filter.createdAt = {};
    if (dateFrom) filter.createdAt.$gte = getStartOfDay(new Date(dateFrom));
    if (dateTo) filter.createdAt.$lte = getEndOfDay(new Date(dateTo));
    return filter;
  }

  if (!frequency || frequency === 'all') return filter;

  const now = new Date();
  let start;

  switch (frequency) {
    case 'daily':
      start = getStartOfDay(now);
      break;
    case 'weekly':
      start = getStartOfWeek(now);
      break;
    case 'monthly':
      start = getStartOfMonth(now);
      break;
    default:
      return filter;
  }

  filter.createdAt = { $gte: start };
  return filter;
};

const buildOrdersFilter = ({ search = '', status = '', dateFrom, dateTo, frequency }) => {
  const filters = [
    buildSearchFilter(search),
    buildDateFilter({ dateFrom, dateTo, frequency }),
  ];

  if (status && status !== 'all' && ORDER_STATUSES.includes(status)) {
    filters.push({ status });
  }

  return filters.reduce((acc, current) => ({ ...acc, ...current }), {});
};

const createOrder = async (orderData) => {
  const orderWithDefaults = {
    ...orderData,
    status: orderData.status || 'pending',
  };
  const order = new Order(orderWithDefaults);
  return order.save();
};

const getOrderById = async (id) => Order.findById(id);

const updateOrder = async (id, orderData) => {
  const order = await Order.findByIdAndUpdate(id, orderData, {
    new: true,
    runValidators: true,
  });
  return order;
};

const updateOrderStatus = async (id, status) => {
  if (!ORDER_STATUSES.includes(status)) {
    const error = new Error('Invalid order status');
    error.statusCode = 400;
    throw error;
  }

  return Order.findByIdAndUpdate(id, { status }, { new: true, runValidators: true });
};

const deleteOrder = async (id) => {
  const order = await Order.findByIdAndDelete(id);
  if (!order) {
    const error = new Error('Order not found');
    error.statusCode = 404;
    throw error;
  }
  return order;
};

const getOrderStats = async () => {
  const today = new Date().toISOString().slice(0, 10);

  const [
    totalOrders,
    completedOrders,
    pendingOrders,
    cancelledOrders,
    invoicedOrders,
    revenueResult,
    pendingAmountResult,
    activeOnSite,
  ] = await Promise.all([
    Order.countDocuments(),
    Order.countDocuments({ status: 'complete' }),
    Order.countDocuments({ status: 'pending' }),
    Order.countDocuments({ status: 'cancelled' }),
    Order.countDocuments({ status: 'invoiced' }),
    Order.aggregate([
      {
        $match: { status: { $nin: ['cancelled'] } },
      },
      {
        $group: {
          _id: null,
          totalRevenue: {
            $sum: { $ifNull: ['$services.totalPrice', 0] },
          },
        },
      },
    ]),
    Order.aggregate([
      {
        $match: { status: 'pending' },
      },
      {
        $group: {
          _id: null,
          pendingAmount: {
            $sum: { $ifNull: ['$services.totalPrice', 0] },
          },
        },
      },
    ]),
    Order.countDocuments({
      status: 'pending',
      visitDate: today,
    }),
  ]);

  return {
    totalOrders,
    completedOrders,
    pendingOrders,
    cancelledOrders,
    invoicedOrders,
    totalRevenue: revenueResult[0]?.totalRevenue || 0,
    pendingAmount: pendingAmountResult[0]?.pendingAmount || 0,
    activeOnSite,
  };
};

const getOrdersPaginated = async ({
  page = 1,
  limit = 10,
  search = '',
  status = '',
  dateFrom = '',
  dateTo = '',
  frequency = 'all',
}) => {
  const parsedPage = Math.max(parseInt(page, 10) || 1, 1);
  const parsedLimit = Math.min(Math.max(parseInt(limit, 10) || 10, 1), 100);
  const skip = (parsedPage - 1) * parsedLimit;
  const filter = buildOrdersFilter({ search, status, dateFrom, dateTo, frequency });

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
  updateOrder,
  updateOrderStatus,
  deleteOrder,
  getOrderStats,
  getOrdersPaginated,
  ORDER_STATUSES,
};
