const orderService = require("../services/orderService");
const { validateOrderData } = require("../utils/validators");

/**
 * @desc    Create new order entry
 * @route   POST /api/orders
 * @access  Public
 */
const createOrder = async (req, res, next) => {
  try {
    const { isValid, errors } = validateOrderData(req.body);
    console.log("Request body in orderController : ", req.body);
    if (!isValid) {
      return res.status(400).json({
        success: false,
        message: "Validation failed, please check your input",
        errors,
      });
    }

    const order = await orderService.createOrder(req.body);
    const fetchUrl = `${req.protocol}://${req.get("host")}/api/orders/${order._id}`;

    res.status(201).json({
      success: true,
      fetchUrl,
      data: order,
    });
  } catch (error) {
    const statusCode = error.statusCode || 400;
    res.status(statusCode).json({
      success: false,
      message: error.message || "Failed to create order",
    });
  }
};

/**
 * @desc    Get order by ID
 * @route   GET /api/orders/:id
 * @access  Public
 */
const getOrderById = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!id || id.length !== 24) {
      return res.status(400).json({
        success: false,
        message: "Invalid order ID format",
      });
    }

    const order = await orderService.getOrderById(id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    const acceptHeader = req.get("accept") || "";
    if (acceptHeader.includes("text/html")) {
      const frontendUrl = process.env.FRONTEND_URL || "http://localhost:5173";
      return res.redirect(`${frontendUrl}/order/${id}`);
    }

    res.status(200).json({
      success: true,
      data: order,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to retrieve order",
    });
  }
};

module.exports = {
  createOrder,
  getOrderById,
};
