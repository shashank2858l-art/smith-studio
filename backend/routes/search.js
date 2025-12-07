const express = require('express');
const router = express.Router();
const { GoogleGenerativeAI } = require('@google/generative-ai');

router.post('/', async (req, res) => {
  const { query } = req.body;
  if (!query) return res.status(400).json({ message: 'Query required' });

  try {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });
    const result = await model.generateContent(
      `User is on Smith Studio photography site. Answer briefly: ${query}`
    );
    const text = result.response.text();
    res.json({ answer: text });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'AI error' });
  }
});

module.exports = router;
