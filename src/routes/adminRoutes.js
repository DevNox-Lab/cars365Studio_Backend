const express = require("express");
const { getStats, getOrders } = require("../controllers/adminController");

const router = express.Router();

router.get("/stats", getStats);
router.get("/orders", getOrders);

module.exports = router;
