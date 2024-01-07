const mongoose = require('mongoose');

const DBMessageSchema = new mongoose.Schema({
    timestamp: { type: Number, required: true },
    ack: { type: Number, required: true },
    name: { type: String, required: true },
    id: { type: String, required: true },
    from: { type: String, default: undefined },
    to: { type: String, default: undefined },
    author: { type: String, default: undefined },
    fromMe: { type: Boolean, required: true },
    fromGroup: { type: Boolean, required: true },
    hasMedia: { type: Boolean, required: true },
    body: { type: String, required: true },
    link: { type: String, default: undefined }
});

// Definir índice único para id y timestamp combinados
DBMessageSchema.index({ id: 1, timestamp: 1 }, { unique: true });

const MessageModel = mongoose.model('Message', DBMessageSchema);

export default MessageModel;