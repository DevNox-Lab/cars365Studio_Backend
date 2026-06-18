/**
 * Validate email format
 * @param {string} email
 * @returns {boolean}
 */
const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Validate order data
 * @param {Object} data
 * @returns {Object} { isValid: boolean, errors: array }
 */
const validateOrderData = (data) => {
  const errors = [];

  // Customer name validation
  if (!data.customerName || typeof data.customerName !== 'string') {
    errors.push('Customer name is required and must be a string');
  }

  // Phone number validation
  if (!data.phoneNumber || typeof data.phoneNumber !== 'string') {
    errors.push('Phone number is required and must be a string');
  }

  // Email validation (if provided)
  if (data.email && !validateEmail(data.email)) {
    errors.push('Invalid email format');
  }

  // Services validation
  if (!Array.isArray(data.services) || data.services.length === 0) {
    errors.push('At least one service must be selected');
  }

  // Vehicle info validation
  if (!data.vehicleInfo || typeof data.vehicleInfo !== 'object') {
    errors.push('Vehicle information is required');
  } else {
    if (!data.vehicleInfo.model) {
      errors.push('Vehicle model is required');
    }
    if (!data.vehicleInfo.carType) {
      errors.push('Vehicle type is required');
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

module.exports = {
  validateEmail,
  validateOrderData,
};
