const mongoose = require('mongoose');

const ORDER_STATUSES = ['pending', 'complete', 'invoiced', 'cancelled'];

const orderSchema = new mongoose.Schema(
  {
    orderNumber: {
      type: String,
      unique: true,
      sparse: true,
    },
    customerName: {
      type: String,
      required: [true, 'Customer name is required'],
      trim: true,
    },
    phoneNumber: {
      type: String,
      required: [true, 'Phone number is required'],
      trim: true,
    },
    address: {
      type: String,
      trim: true,
      default: '',
    },
    notes: {
      type: String,
      trim: true,
      default: '',
    },
    status: {
      type: String,
      enum: ORDER_STATUSES,
      default: 'pending',
    },
    visitDate: {
      type: String,
      required: [true, 'Visit date is required'],
    },
    visitTime: {
      type: String,
      required: [true, 'Visit time is required'],
    },
    vehicleInfo: {
      model: String,
      carType: String,
      yearOfManufacture: Number,
      color: String,
    },
    plateInfo: {
      city: String,
      plateType: String,
      plateLetter: String,
      plateNumber: String,
    },
    services: {
      selectedServiceIds: [String],
      selectedServices: [
        {
          serviceId: String,
          serviceName: String,
          price: Number,
          multiplier: Number,
          finalPrice: Number,
        },
      ],
      totalPrice: {
        type: Number,
        required: true,
      },
      currency: {
        type: String,
        default: 'AED',
      },
    },
  },
  {
    timestamps: true,
  }
);

orderSchema.pre('save', async function generateOrderNumber() {
  if (this.orderNumber) return;

  const count = await mongoose.model('Order').countDocuments();
  this.orderNumber = `ORD-${1001 + count}`;
});

module.exports = mongoose.model('Order', orderSchema);
module.exports.ORDER_STATUSES = ORDER_STATUSES;
