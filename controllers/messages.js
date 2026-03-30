const Message = require('../schemas/Message');
const mongoose = require('mongoose');

module.exports = {
    // 1. Lấy toàn bộ tin nhắn giữa User A và User B
    getMessagesBetweenUsers: async (currentUser, targetUser) => {
        return await Message.find({
            $or: [
                { from: currentUser, to: targetUser },
                { from: targetUser, to: currentUser }
            ]
        }).sort({ createdAt: 1 }); // Tin nhắn cũ ở trên, mới ở dưới
    },

    // 2. Lưu tin nhắn mới vào Database
    createMessage: async (from, to, type, content) => {
        let newMessage = new Message({
            from: from,
            to: to,
            messageContent: {
                type: type,
                text: content
            }
        });
        return await newMessage.save();
    },

    // 3. Lấy tin nhắn cuối cùng của mỗi người (Danh sách inbox)
    getLastMessages: async (currentUserId) => {
        const uid = new mongoose.Types.ObjectId(currentUserId);
        return await Message.aggregate([
            {
                $match: { $or: [{ from: uid }, { to: uid }] }
            },
            { $sort: { createdAt: -1 } },
            {
                $group: {
                    _id: {
                        $cond: [
                            { $eq: ["$from", uid] }, 
                            "$to", 
                            "$from"
                        ]
                    },
                    lastMessage: { $first: "$$ROOT" }
                }
            },
            {
                $lookup: {
                    from: 'users', // Tên collection User trong DB
                    localField: '_id',
                    foreignField: '_id',
                    as: 'userInfo'
                }
            },
            { $unwind: '$userInfo' },
            {
                $project: {
                    "userInfo.password": 0, // Ẩn mật khẩu cho an toàn
                    "userInfo.forgotpasswordToken": 0
                }
            }
        ]);
    }
};