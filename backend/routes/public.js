const express = require('express');
const fs = require('fs-extra');
const path = require('path');
const router = express.Router();

const galleryPath = path.join(__dirname, '..', 'models', 'gallery.json');

router.get('/gallery', async (req, res) => {
  try {
    const gallery = await fs.readJson(galleryPath);
    res.json(gallery);
  } catch (err) {
    res.json([]);
  }
});

module.exports = router;
