// routes/chatbot.js
const express = require('express');
const router = express.Router();
const ChatbotController = require('../controllers/ChatbotController');

router.post('/chat', ChatbotController.handleChatbotRequest);

module.exports = router;