const mongoose = require('mongoose');

const { Schema } = mongoose;

const TaskSchema = new Schema({
  name: {
    type: String,
    required: true,
    minlen: 5,
    maxlen: 128
  },
  priority: {
    type: String,
    required: true
  },
  project: { type: Schema.Types.ObjectId, ref: 'Project' },
  members: [{ type: Schema.Types.ObjectId, ref: 'User' }]
}, { timestamps: { createdAt: 'createdAt' } });

class Task {

}

module.exports = () => {
  TaskSchema.loadClass(Task);
  return mongoose.model('Task', TaskSchema);
};
