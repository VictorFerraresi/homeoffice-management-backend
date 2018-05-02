"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
exports.ProjectSchema = new mongoose_1.Schema({
    name: {
        type: String,
        required: true,
        index: { unique: true },
        minlen: 5,
        maxlen: 128
    },
    createdBy: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    members: [{ type: mongoose_1.Schema.Types.ObjectId, ref: 'User' }]
}, { timestamps: { createdAt: 'createdAt' } });
exports.Project = mongoose_1.model("Project", exports.ProjectSchema);
