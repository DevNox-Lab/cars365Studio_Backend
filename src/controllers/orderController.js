const orderService = require('../services/orderService');

/**
 * @desc    Create new order entry
 * @route   POST /api/orders
 * @access  Public
 */
const createOrder = async (req, res) => {
  try {
    const order = await orderService.createOrder(req.body);
    const fetchUrl = `${req.protocol}://${req.get('host')}/api/orders/${order._id}`;
    
    res.status(201).json({
      success: true,
      fetchUrl: fetchUrl,
      data: order
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

/**
 * @desc    Get order by ID
 * @route   GET /api/orders/:id
 * @access  Public
 */
const getOrderById = async (req, res) => {
  try {
    const order = await orderService.getOrderById(req.params.id);
    
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    res.status(200).json({
      success: true,
      data: order
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Invalid Order ID'
    });
  }
};

/**
 * @desc    Get all orders
 * @route   GET /api/orders
 * @access  Public
 */
const getOrders = async (req, res) => {
  try {
    const orders = await orderService.getAllOrders();
    res.status(200).json({
      success: true,
      count: orders.length,
      data: orders
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server Error'
    });
  }
};

module.exports = {
  createOrder,
  getOrders,
  getOrderById
};
