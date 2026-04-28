const bcrypt = require('bcryptjs');
const { User } = require('./models');

const DEFAULT_ADMIN = {
  email: 'admin@admin.com',
  password: 'Admin123!'
};

const DEFAULT_USER = {
  email: 'demo@demo.com',
  password: 'Password123!'
};

module.exports = async function seed() {
  const admin = await User.findOne({ where: { email: DEFAULT_ADMIN.email } });
  if (!admin) {
    const hashedPassword = await bcrypt.hash(DEFAULT_ADMIN.password, 10);
    await User.create({
      email: DEFAULT_ADMIN.email,
      password: hashedPassword,
      isAdmin: true
    });
    console.log('Created default admin:', DEFAULT_ADMIN.email);
  } else {
    console.log('Default admin already exists.');
  }

  const user = await User.findOne({ where: { email: DEFAULT_USER.email } });
  if (!user) {
    const hashedPassword = await bcrypt.hash(DEFAULT_USER.password, 10);
    await User.create({ email: DEFAULT_USER.email, password: hashedPassword });
    console.log('Created default user:', DEFAULT_USER.email);
  } else {
    console.log('Default user already exists.');
  }
};
