const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
    from: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user', // Đảm bảo tên này khớp với tên model User của bạn
        required: true
    },
    to: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: true
    },
    messageContent: {
        type: {
            type: String,
            enum: ['file', 'text'],
            required: true
        },
        text: {
            type: String,
            required: true
        }
    }
}, { timestamps: true });

module.exports = mongoose.model('message', messageSchema);