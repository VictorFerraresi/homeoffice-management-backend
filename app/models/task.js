const mongoose = require('mongoose');

const { Schema } = mongoose;

const TaskSchema = new Schema({
    name: {
        type: String,
        required: true,
        index: { unique: true },
        minlen: 5,
        maxlen: 128,
        match: [/^[a-zA-Z0-9]+([_-]?[a-zA-Z0-9])*$/, 'invalid project name']
    },
    priority: {
        type: String,
        required: true,
        index: { unique: true },
    },
    project: 
        { type: Schema.Types.ObjectId, ref: 'Project' }
    ,
}, { timestamps: { createdAt: 'createdAt' } });

class Task {

}

module.exports = () => {
    TaskSchema.loadClass(Task);
    return mongoose.model('Task', TaskSchema);
};
