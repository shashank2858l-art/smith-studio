const express = require('express');
const fs = require('fs-extra');
const path = require('path');
const router = express.Router();

const bookingsPath = path.join(__dirname, '..', 'models', 'bookings.json');

router.get('/', async (req, res) => {
  const data = await fs.readJson(bookingsPath);
  res.json(data);
});

router.post('/', async (req, res) => {
  const { service, date, location, email, phone, details } = req.body;
  if (!service || !date || !email) {
    return res.status(400).json({ message: 'Missing fields' });
  }
  const bookings = await fs.readJson(bookingsPath);
  const newBooking = {
    id: bookings.length + 1,
    service,
    date,
    location,
    email,
    phone,
    details,
    status: 'Pending',
    createdAt: new Date().toISOString()
  };
  bookings.push(newBooking);
  await fs.writeJson(bookingsPath, bookings, { spaces: 2 });
  res.status(201).json(newBooking);
});

module.exports = router;
