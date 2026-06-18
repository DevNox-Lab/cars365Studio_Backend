const jwt = require("jsonwebtoken");
const Admin = require("../models/Admin");

const signToken = (adminId) => {
  if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET is not configured");
  }

  return jwt.sign({ id: adminId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "7d",
  });
};

const loginAdmin = async ({ email, password }) => {
  if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET is not configured IN loginAdmin");
  }

  if (!email || !password) {
    const error = new Error("Email and password are required");
    error.statusCode = 400;
    throw error;
  }

  const admin = await Admin.findOne({
    email: email.toLowerCase().trim(),
  }).select("+password");

  if (!admin || !(await admin.comparePassword(password))) {
    const error = new Error("Invalid credentials");
    error.statusCode = 401;
    throw error;
  }

  const token = signToken(admin._id);

  return {
    token,
    user: {
      id: admin._id,
      email: admin.email,
      name: admin.name,
    },
  };
};

const getAdminById = async (id) => {
  if (!id) {
    throw new Error("Admin ID is required");
  }
  return Admin.findById(id).select("-password");
};

module.exports = {
  loginAdmin,
  getAdminById,
  signToken,
};
