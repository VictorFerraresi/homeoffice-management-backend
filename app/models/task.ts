import { Document, Schema, model, Model } from "mongoose";
import { ObjectId } from "bson";
import { IUser } from "./user";

export interface ITask extends Document {
  name: string,
  priority: string,
  status: string,
  project: ObjectId,
  members?: IUser[]
}

export const TaskSchema = new Schema({
  name: {
    type: String,
    required: true,
    minlen: 5,
    maxlen: 128
  },
  priority: {
    type: String,
    required: true,
    enum: ['low', 'medium', 'high', 'ultra']
  },
  status: {
    type: String,
    enum: ['unassigned', 'assigned', 'doing', 'done']
  },
  project: { type: Schema.Types.ObjectId, ref: 'Project', required: true },
  members: [{ type: Schema.Types.ObjectId, ref: 'User' }]
}, { timestamps: { createdAt: 'createdAt' } });

export const Task = model<ITask>("Task", TaskSchema);