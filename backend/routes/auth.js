const express = require('express');
const jwt = require('jsonwebtoken');
const router = express.Router();

// single hardcoded admin
const ADMIN_EMAIL = 'admin@smithstudio.com';
const ADMIN_PASS = 'admin123';

router.post('/login', (req, res) => {
  const { email, password } = req.body;
  if (email === ADMIN_EMAIL && password === ADMIN_PASS) {
    const token = jwt.sign(
      { email, role: 'admin' },
      process.env.JWT_SECRET,
      { expiresIn: '2h' }
    );
    return res.json({ token });
  }
  return res.status(401).json({ message: 'Invalid credentials' });
});

module.exports = router;
