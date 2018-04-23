const mongoose = require('mongoose');

const { Schema } = mongoose;

const UserSchema = new Schema({
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

class User {

}

module.exports = () => {
  UserSchema.loadClass(User);
  return mongoose.model('User', UserSchema);
};
