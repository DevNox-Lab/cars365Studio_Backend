const orderService = require('../services/orderService');

const getStats = async (req, res, next) => {
  try {
    const stats = await orderService.getOrderStats();

    res.status(200).json({
      success: true,
      data: stats,
    });
  } catch (error) {
    console.error('Error fetching stats:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch order statistics',
    });
  }
};

const getOrders = async (req, res, next) => {
  try {
    const { page, limit, search } = req.query;
    const result = await orderService.getOrdersPaginated({ page, limit, search });

    res.status(200).json({
      success: true,
      ...result,
    });
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch orders',
    });
  }
};

module.exports = {
  getStats,
  getOrders,
};
