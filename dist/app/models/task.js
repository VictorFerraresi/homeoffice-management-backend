"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
exports.taskSchema = new mongoose_1.Schema({
    name: {
        type: String,
        required: true,
        minlen: 5,
        maxlen: 128,
    },
    priority: {
        type: String,
        required: true,
        enum: ['low', 'medium', 'high', 'ultra'],
    },
    status: {
        type: String,
        enum: ['unassigned', 'assigned', 'doing', 'done'],
    },
    project: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Project', required: true },
    members: [{ type: mongoose_1.Schema.Types.ObjectId, ref: 'User' }],
}, { timestamps: { createdAt: 'createdAt' } });
exports.task = mongoose_1.model('Task', exports.taskSchema);
