import { Document, Schema, model, Model } from 'mongoose';
import { IUser } from './user';

export interface IProject extends Document {
  name: string;
  createdBy: IUser;
  members?: IUser[];
}

export const projectSchema = new Schema({
  name: {
    type: String,
    required: true,
    index: { unique: true },
    minlen: 5,
    maxlen: 128,
  },
  createdBy: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  members: [{ type: Schema.Types.ObjectId, ref: 'User' }],
// tslint:disable-next-line:align
}, { timestamps: { createdAt: 'createdAt' } });

export const project = model<IProject>('Project', projectSchema);
