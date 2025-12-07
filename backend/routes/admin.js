const express = require('express');
const fs = require('fs-extra');
const path = require('path');
const auth = require('../middleware/auth');
const upload = require('../middleware/multer');

const router = express.Router();

const servicesPath = path.join(__dirname, '..', 'models', 'services.json');
const galleryPath = path.join(__dirname, '..', 'models', 'gallery.json');
const equipmentPath = path.join(__dirname, '..', 'models', 'equipment.json');
const bookingsPath = path.join(__dirname, '..', 'models', 'bookings.json');

// all admin routes require token
router.use(auth);

// services
router.get('/services', async (req, res) => {
  res.json(await fs.readJson(servicesPath));
});

router.post('/services', async (req, res) => {
  const services = await fs.readJson(servicesPath);
  const service = { id: services.length + 1, ...req.body };
  services.push(service);
  await fs.writeJson(servicesPath, services, { spaces: 2 });
  res.status(201).json(service);
});

// equipment
router.get('/equipment', async (req, res) => {
  res.json(await fs.readJson(equipmentPath));
});

router.post('/equipment', async (req, res) => {
  const equipment = await fs.readJson(equipmentPath);
  const item = { id: equipment.length + 1, ...req.body };
  equipment.push(item);
  await fs.writeJson(equipmentPath, equipment, { spaces: 2 });
  res.status(201).json(item);
});

/* gallery upload
router.post('/gallery', upload.single('image'), async (req, res) => {
  const gallery = await fs.readJson(galleryPath);
  const item = {
    id: gallery.length + 1,
    url: '/uploads/' + req.file.filename,
    title: req.body.title || 'Untitled'
  };
  gallery.push(item);
  await fs.writeJson(galleryPath, gallery, { spaces: 2 });
  res.status(201).json(item);
});

router.get('/bookings', async (req, res) => {
  res.json(await fs.readJson(bookingsPath));
});

module.exports = router; */

// gallery GET (for admin to see what's uploaded)
router.get('/gallery', async (req, res) => {
  try {
    const gallery = await fs.readJson(galleryPath);
    res.json(gallery);
  } catch (err) {
    console.error('Gallery read error:', err);
    res.json([]);  // Return empty array if file doesn't exist
  }
});

// gallery POST (upload new image)
router.post('/gallery', upload.single('image'), async (req, res) => {
  try {
    const gallery = await fs.readJson(galleryPath);
    const item = {
      id: gallery.length + 1,
      url: '/uploads/' + req.file.filename,
      title: req.body.title || 'Untitled'
    };
    gallery.push(item);
    await fs.writeJson(galleryPath, gallery, { spaces: 2 });
    res.status(201).json(item);
  } catch (err) {
    console.error('Gallery upload error:', err);
    res.status(500).json({ message: 'Upload failed: ' + err.message });
  }
});

module.exports = router;
