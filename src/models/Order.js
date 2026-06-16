const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  customerName: {
    type: String,
    required: [true, 'Customer name is required'],
    trim: true
  },
  phoneNumber: {
    type: String,
    required: [true, 'Phone number is required'],
    trim: true
  },
  visitDate: {
    type: String,
    required: [true, 'Visit date is required']
  },
  visitTime: {
    type: String,
    required: [true, 'Visit time is required']
  },
  vehicleInfo: {
    model: String,
    carType: String,
    yearOfManufacture: Number,
    color: String
  },
  plateInfo: {
    city: String,
    plateType: String,
    plateLetter: String,
    plateNumber: String
  },
  services: {
    selectedServiceIds: [String],
    selectedServices: [{
      serviceId: String,
      serviceName: String,
      price: Number,
      multiplier: Number,
      finalPrice: Number
    }],
    totalPrice: {
      type: Number,
      required: true
    },
    currency: {
      type: String,
      default: 'AED'
    }
  },
  status: {
    type: String,
    enum: ['pending', 'active', 'completed'],
    default: 'pending'
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Order', orderSchema);
