const bcrypt = require('bcryptjs');
const Admin = require('../models/Admin');

/**
 * Seed default admin from environment variables.
 * Idempotent — skips if admin with ADMIN_EMAIL already exists.
 */
const seedAdmin = async () => {
  const { ADMIN_NAME, ADMIN_EMAIL, ADMIN_PASSWORD } = process.env;

  if (!ADMIN_NAME || !ADMIN_EMAIL || !ADMIN_PASSWORD) {
    console.warn('Admin seeder skipped: ADMIN_NAME, ADMIN_EMAIL, or ADMIN_PASSWORD not set');
    return;
  }

  const existingAdmin = await Admin.findOne({ email: ADMIN_EMAIL.toLowerCase() });

  if (existingAdmin) {
    console.log('Admin seeder: admin already exists, skipping');
    return;
  }

  const hashedPassword = await bcrypt.hash(ADMIN_PASSWORD, 10);

  await Admin.create({
    name: ADMIN_NAME,
    email: ADMIN_EMAIL,
    password: hashedPassword
  });

  console.log('Admin seeder: admin created successfully');
};

module.exports = seedAdmin;
