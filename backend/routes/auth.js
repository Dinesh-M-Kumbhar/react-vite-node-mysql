const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { User } = require('../models');
const config = require('../config/config');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required.' });
  }

  const user = await User.findOne({ where: { email } });
  if (!user) {
    return res.status(401).json({ message: 'Invalid credentials.' });
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return res.status(401).json({ message: 'Invalid credentials.' });
  }

  const token = jwt.sign(
    { id: user.id, email: user.email, isAdmin: user.isAdmin },
    config.jwtSecret,
    { expiresIn: config.jwtExpiresIn }
  );

  return res.json({
    token,
    user: {
      id: user.id,
      email: user.email,
      isAdmin: user.isAdmin
    }
  });
});

router.post('/users', authMiddleware, async (req, res) => {
  if (!req.user.isAdmin) {
    return res.status(403).json({ message: 'Admin access required.' });
  }

  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required.' });
  }

  const existingUser = await User.findOne({ where: { email } });
  if (existingUser) {
    return res.status(409).json({ message: 'A user with that email already exists.' });
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const createdUser = await User.create({
    email,
    password: hashedPassword,
    isAdmin: false
  });

  return res.status(201).json({
    user: {
      id: createdUser.id,
      email: createdUser.email,
      isAdmin: createdUser.isAdmin
    }
  });
});

router.get('/profile', authMiddleware, async (req, res) => {
  const user = await User.findByPk(req.user.id, {
    attributes: ['id', 'email', 'isAdmin']
  });
  if (!user) {
    return res.status(404).json({ message: 'User not found.' });
  }

  return res.json({ user });
});

module.exports = router;
