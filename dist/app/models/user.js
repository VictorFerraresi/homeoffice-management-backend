"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
exports.UserAttributeSchema = new mongoose_1.Schema({
    user_id: { type: mongoose_1.Schema.Types.ObjectId, ref: 'User', index: true },
    attribute: {
        type: String,
        enum: ['active', 'banned', 'moderator', 'admin'],
        index: true
    },
    expiresAt: Date
}, { timestamps: { createdAt: 'createdAt' } });
exports.UserSchema = new mongoose_1.Schema({
    username: {
        type: String,
        required: true,
        index: { unique: true },
        minlen: 5,
        maxlen: 16,
        match: [/^[a-zA-Z0-9]+([_-]?[a-zA-Z0-9])*$/, 'invalid username'],
        lowercase: true
    },
    email: {
        type: String,
        required: true,
        index: { unique: true },
        match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'invalid email'],
        lowercase: true
    },
    password: { type: String, required: true }
}, { timestamps: { createdAt: 'createdAt' } });
exports.UserSchema.virtual('attributes', {
    ref: 'UserAttribute',
    localField: '_id',
    foreignField: 'user',
    justOne: false
});
exports.UserAttribute = mongoose_1.model("UserAttribute", exports.UserAttributeSchema);
exports.User = mongoose_1.model("User", exports.UserSchema);
