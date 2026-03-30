var express = require('express');
var router = express.Router();
const messageController = require('../controllers/messages');
const { checkLogin } = require('../utils/authHandler.js');
const { uploadMessageFile } = require('../utils/uploadHandler');
const { postMessageValidator, getUserIdValidator, validateResult } = require('../utils/validatorHandler');

// Yêu cầu 1: GET /userID - Lấy toàn bộ chat với 1 người
router.get('/:userID', checkLogin, getUserIdValidator, validateResult, async (req, res) => {
    const messages = await messageController.getMessagesBetweenUsers(req.userId, req.params.userID);
    res.send(messages);
});

// Yêu cầu 2: POST / - Gửi tin nhắn (Text hoặc File)
router.post('/', checkLogin, uploadMessageFile.single('file'), postMessageValidator, validateResult, async (req, res) => {
    let type = 'text';
    let content = req.body.text;

    if (req.file) {
        type = 'file';
        content = req.file.path; // Lưu path dẫn đến file
    }

    const newMessage = await messageController.createMessage(req.userId, req.body.to, type, content);
    res.send(newMessage);
});

// Yêu cầu 3: GET / - Lấy danh sách tin nhắn cuối cùng (Inbox)
router.get('/', checkLogin, async (req, res) => {
    const lastMessages = await messageController.getLastMessages(req.userId);
    res.send(lastMessages);
});

module.exports = router;