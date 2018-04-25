const mongoose = require('mongoose');

const { Schema } = mongoose;

const ProjectSchema = new Schema({
  name: {
    type: String,
    required: true,
    index: { unique: true },
    minlen: 5,
    maxlen: 128
  },
  createdBy: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  members: [{ type: Schema.Types.ObjectId, ref: 'User' }]
}, { timestamps: { createdAt: 'createdAt' } });

class Project {

}

module.exports = () => {
  ProjectSchema.loadClass(Project);
  return mongoose.model('Project', ProjectSchema);
};
