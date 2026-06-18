const Admin = require('../models/Admin');

const seedAdmin = async () => {
  const existingAdmin = await Admin.findOne();

  if (existingAdmin) {
    console.log('Admin user already exists, skipping seed.');
    return existingAdmin;
  }

  const email = process.env.ADMIN_EMAIL || 'admin@cars365studio.com';
  const password = process.env.ADMIN_PASSWORD || 'Admin@123';
  const name = process.env.ADMIN_NAME || 'Cars365 Admin';

  const admin = await Admin.create({
    email,
    password,
    name,
  });

  console.log(`Admin user seeded: ${admin.email}`);
  return admin;
};

module.exports = seedAdmin;
