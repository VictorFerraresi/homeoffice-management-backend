import { Document, Schema, model, Model } from 'mongoose';
import { ObjectId } from 'bson';

export interface IUserAttribute extends Document {
  user_id: ObjectId;
  attribute: string;
}

export const userAttributeSchema = new Schema({
  user_id: { type: Schema.Types.ObjectId, ref: 'User', index: true },
  attribute: {
    type: String,
    enum: ['active', 'banned', 'moderator', 'admin'],
    index: true,
  },
  expiresAt: Date,
// tslint:disable-next-line:align
}, { timestamps: { createdAt: 'createdAt' } });

export interface IUser extends Document {
  username: string;
  email: string;
  password: string;
  attributes?: IUserAttribute[];
}

export const userSchema = new Schema({
  username: {
    type: String,
    required: true,
    index: { unique: true },
    minlen: 5,
    maxlen: 16,
    match: [/^[a-zA-Z0-9]+([_-]?[a-zA-Z0-9])*$/, 'invalid username'],
    lowercase: true,
  },
  email: {
    type: String,
    required: true,
    index: { unique: true },
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'invalid email'],
    lowercase: true,
  },
  password: { type: String, required: true },
// tslint:disable-next-line:align
}, { timestamps: { createdAt: 'createdAt' } });

userSchema.virtual('attributes', {
  ref: 'UserAttribute',
  localField: '_id',
  foreignField: 'user',
  justOne: false,
});

export const userAttribute = model<IUserAttribute>('UserAttribute', userAttributeSchema);
export const user = model<IUser>('User', userSchema);
