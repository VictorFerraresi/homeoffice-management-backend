const mongoose = require('mongoose');

const { Schema } = mongoose;

const UserAttributeSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: 'User' },
  attribute: {
    type: String,
    enum: ['active', 'banned', 'moderator', 'admin']
  },
  expiresAt: Date
}, { timestamps: { createdAt: 'createdAt' } });

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

UserSchema.virtual('attributes', {
  ref: 'UserAttribute',
  localField: '_id',
  foreignField: 'user',
  justOne: false
});

class User {

}

module.exports = () => {
  UserAttributeSchema.index({ user: 1, attribute: 1 }, { unique: true });
  mongoose.model('UserAttribute', UserAttributeSchema);

  UserSchema.loadClass(User);
  return mongoose.model('User', UserSchema);
};
