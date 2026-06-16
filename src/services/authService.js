const bcrypt = require('bcryptjs');
const Admin = require('../models/Admin');
const { generateToken } = require('../utils/jwt');

/**
 * Authenticate admin and return JWT token
 * @param {string} email
 * @param {string} password
 * @returns {Promise<{ token: string, admin: Object }>}
 */
const loginAdmin = async (email, password) => {
  const admin = await Admin.findOne({ email: email.toLowerCase() }).select('+password');

  if (!admin) {
    throw new Error('Invalid credentials');
  }

  const isMatch = await bcrypt.compare(password, admin.password);

  if (!isMatch) {
    throw new Error('Invalid credentials');
  }

  const token = generateToken({
    id: admin._id,
    role: admin.role
  });

  const adminData = admin.toObject();
  delete adminData.password;

  return {
    token,
    admin: adminData
  };
};

module.exports = { loginAdmin };
