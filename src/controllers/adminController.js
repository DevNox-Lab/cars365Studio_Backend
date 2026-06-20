const orderService = require('../services/orderService');

const getStats = async (req, res) => {
  try {
    if (!req.admin) {
      return res.status(401).json({ success: false, message: 'Please login first' });
    }

    const stats = await orderService.getOrderStats();
    res.status(200).json({ success: true, data: stats });
  } catch (error) {
    console.error('Error fetching stats:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch order statistics' });
  }
};

const getOrders = async (req, res) => {
  try {
    if (!req.admin) {
      return res.status(401).json({ success: false, message: 'Please login first' });
    }

    const { page, limit, search, status, dateFrom, dateTo, frequency } = req.query;
    const result = await orderService.getOrdersPaginated({
      page,
      limit,
      search,
      status,
      dateFrom,
      dateTo,
      frequency,
    });

    res.status(200).json({ success: true, ...result });
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch orders' });
  }
};

const createOrder = async (req, res) => {
  try {
    if (!req.admin) {
      return res.status(401).json({ success: false, message: 'Please login first' });
    }

    const order = await orderService.createOrder(req.body);
    res.status(201).json({ success: true, data: order });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

const updateOrder = async (req, res) => {
  try {
    if (!req.admin) {
      return res.status(401).json({ success: false, message: 'Please login first' });
    }

    const order = await orderService.updateOrder(req.params.id, req.body);
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    res.status(200).json({ success: true, data: order });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

const updateOrderStatus = async (req, res) => {
  try {
    if (!req.admin) {
      return res.status(401).json({ success: false, message: 'Please login first' });
    }

    const { status } = req.body;
    const order = await orderService.updateOrderStatus(req.params.id, status);

    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    res.status(200).json({ success: true, data: order });
  } catch (error) {
    res.status(error.statusCode || 400).json({
      success: false,
      message: error.message,
    });
  }
};

const deleteOrder = async (req, res) => {
  try {
    if (!req.admin) {
      return res.status(401).json({ success: false, message: 'Please login first' });
    }

    await orderService.deleteOrder(req.params.id);
    res.status(200).json({ success: true, message: 'Order deleted successfully' });
  } catch (error) {
    res.status(error.statusCode || 400).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  getStats,
  getOrders,
  createOrder,
  updateOrder,
  updateOrderStatus,
  deleteOrder,
};
