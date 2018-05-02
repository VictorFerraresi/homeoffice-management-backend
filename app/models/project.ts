import { Document, Schema, model, Model } from "mongoose";
import { IUser } from "./user";

export interface IProject extends Document {
  name: string,
  createdBy: IUser, 
  members?: IUser[]
}

export const ProjectSchema = new Schema({
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

export const Project = model<IProject>("Project", ProjectSchema);
